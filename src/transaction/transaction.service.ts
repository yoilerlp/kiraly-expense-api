import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  Between,
  DataSource,
  FindOneOptions,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  QueryRunner,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Account, Category, TransactionFile } from '@/entities';
import { IUserToken } from '@/common/interface/userToken';
import { FileService } from '@/file/file.service';
import {
  FilterTransactionDto,
  GetBalanceDto,
} from './dto/filter-transaction.dto';
import { generateSortBasicFilter } from '@/common/helper/filter';
import { GET_MIN_AND_MAX_TRANSACTION_DATE } from '@/common/helper/query';
import { getEndOfMonth } from '@/common/helper/date';
import { TransactionType } from './interface/transaction.interface';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionFile)
    private transactionFileRepository: Repository<TransactionFile>,
    private dataSource: DataSource,
    private fileService: FileService,
  ) {}

  async getMinAndMaxTransactionDate(user: IUserToken) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();

      const result = await queryRunner.query(GET_MIN_AND_MAX_TRANSACTION_DATE, [
        user.userId,
      ]);
      const data = result[0];
      return data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error getting min and max transaction date',
      );
    } finally {
      // Liberar la conexión independientemente de si la consulta tuvo éxito o no
      await queryRunner.release();
    }
  }

  async getUserBalanceByMonth({
    user,
    query,
  }: {
    user: IUserToken;
    query: GetBalanceDto;
  }) {
    try {
      const startdate = `${query.year}-${query.month}-01`;

      const end = getEndOfMonth(new Date(startdate));

      const whereOptions: FindOneOptions<Transaction>['where'] = {
        userId: user.userId,
      };

      whereOptions.createdAt = Between(new Date(startdate), new Date(end));

      const transactions = await this.transactionRepository.find({
        where: whereOptions,
        order: {
          createdAt: 'ASC',
        },
      });

      const balance = transactions?.reduce(
        (acc, curr) => {
          const { type, amount } = curr;

          if (type === TransactionType.INCOME) {
            acc.income += amount;
          } else if (type === TransactionType.EXPENSE) {
            acc.expense += amount;
          }

          return acc;
        },
        {
          expense: 0,
          income: 0,
        },
      );

      return {
        balance,
        transactions,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error getting user balance');
    }
  }

  async create({
    data,
    user,
    files,
  }: {
    data: CreateTransactionDto;
    user: IUserToken;
    files: Express.Multer.File[];
  }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let filesUploaded: Awaited<
      ReturnType<typeof this.fileService.uploadFileToStore>
    >[] = [];

    try {
      // check values
      // this.validateTransactinValues({
      //   data,
      //   user,
      //   queryRunner,
      // });

      // create transaction
      const transaction = this.transactionRepository.create({
        ...data,
        userId: user.userId,
      });

      await queryRunner.manager.save(transaction);

      // upload files
      filesUploaded = await this.fileService.uploadMultiplesFilesToStore(files);

      await queryRunner.manager.save(filesUploaded);

      // create transaction file items
      const transactionsFilesCreated = this.transactionFileRepository.create(
        filesUploaded.map((file) => ({
          transaction,
          file,
        })),
      );

      await queryRunner.manager.save(transactionsFilesCreated);

      // commit transaction
      await queryRunner.commitTransaction();

      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // delete uploaded files
      if (filesUploaded.length > 0) {
        await Promise.all(
          filesUploaded.map((file) =>
            this.fileService.removeFileInStore(file.key),
          ),
        );
      }
      this.handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update({
    id,
    data,
    user,
    files,
  }: {
    id: string;
    data: UpdateTransactionDto;
    user: IUserToken;
    files: Express.Multer.File[];
  }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let filesUploaded: Awaited<
      ReturnType<typeof this.fileService.uploadFileToStore>
    >[] = [];

    try {
      // eslint-disable-next-line prefer-const
      let { filesToDelete, ...restFields } = data;

      const currentTransaction = await this.transactionRepository.findOneBy({
        id,
      });

      // validate if user can update this transaction
      if (currentTransaction.userId !== user.userId) {
        throw new ForbiddenException(
          'You are not allowed to update this transaction',
        );
      }

      // Update transaction
      await queryRunner.manager.update(Transaction, id, {
        ...restFields,
      });

      // upload files
      filesUploaded = await this.fileService.uploadMultiplesFilesToStore(files);

      await queryRunner.manager.save(filesUploaded);

      // create transaction file items
      const transactionsFilesCreated = this.transactionFileRepository.create(
        filesUploaded.map((file) => ({
          transaction: { id },
          file,
        })),
      );

      await queryRunner.manager.save(transactionsFilesCreated);

      // delete files
      if (filesToDelete) {
        const filesToDeleteParsed: string[] =
          JSON.parse(filesToDelete as any) || [];
          
        queryRunner.manager.delete(TransactionFile, {
          id: In(
            filesToDeleteParsed.map((transactionFileId) => transactionFileId),
          ),
        });
      }

      // commit transaction
      await queryRunner.commitTransaction();

      return {
        ...currentTransaction,
        ...restFields,
        files: filesUploaded,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // delete uploaded files
      if (filesUploaded.length > 0) {
        await Promise.all(
          filesUploaded.map((file) =>
            this.fileService.removeFileInStore(file.key),
          ),
        );
      }
      this.handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll({
    userId,
    query,
  }: {
    userId: string;
    query: FilterTransactionDto;
  }) {
    const { limit = 10, page = 1, orderBy, type } = query || {};

    const orderResultBy = generateSortBasicFilter({
      orderBy,
    });

    const skip = Number(page - 1) * Number(limit) || 0;

    const take = Number(limit) || 10;

    const whereOptions: FindOneOptions<Transaction>['where'] = {
      userId: userId,
    };

    // fitler for type of transaction
    if (type && type.length > 0) {
      whereOptions.type = In(type);
    }
    // filter for categories
    if (query.categories && query.categories.length > 0) {
      whereOptions.categoryId = In(query.categories);
    }
    // filter for accounts
    if (query.accounts && query.accounts.length > 0) {
      whereOptions.accountId = In(query.accounts);
    }

    // filter for dates
    if (query.minDate || query.maxDate) {
      if (query.minDate) {
        whereOptions.createdAt = MoreThanOrEqual(new Date(query.minDate));
      }

      if (query.maxDate) {
        whereOptions.createdAt = LessThanOrEqual(new Date(query.maxDate));
      }

      if (query.minDate && query.maxDate) {
        whereOptions.createdAt = Between(
          new Date(query.minDate),
          new Date(query.maxDate),
        );
      }
    }

    const [result, total] = await this.transactionRepository.findAndCount({
      relations: ['account', 'category', 'transactionFiles'],
      where: whereOptions,
      order: orderResultBy,
      take,
      skip,
    });

    return {
      rows: result,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
      relations: ['account', 'category', 'transactionFiles'],
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    return transaction;
  }

  async deleteOne({ id, user }: { id: string; user: IUserToken }) {
    const transaction = await this.findOne(id);

    if (transaction.userId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this transaction',
      );
    }
    return this.transactionRepository.remove(transaction);
  }

  async insertRandosTransactions(user: IUserToken) {
    const accountIds = [
      'bf82f6d9-230d-49e4-a4aa-ca972bebac5a',
      '7e70390f-5618-48ab-8287-3cd082180bdf',
    ];

    const categoryIds = [
      '98791e6e-369a-49e0-978c-85e869109b4f',
      '86f33f4c-fc5b-4ff2-a28d-5815cb097937',
      '13a9b1d5-197c-41eb-8d1a-72fd3f5cb42a',
    ];

    const transactionTypes = ['EXPENSE', 'INCOME'];

    const generateRandomTransaction = (date: Date) => {
      const description =
        'Transacción new sin UTC DB #' + Math.floor(Math.random() * 1000); // Descripción aleatoria
      const amount = Math.random() * 1000; // Monto aleatorio
      const type =
        transactionTypes[Math.floor(Math.random() * transactionTypes.length)]; // Tipo de transacción aleatorio
      const accountId =
        accountIds[Math.floor(Math.random() * accountIds.length)]; // ID de cuenta aleatorio
      const categoryId =
        categoryIds[Math.floor(Math.random() * categoryIds.length)]; // ID de categoría aleatorio

      return this.transactionRepository.create({
        accountId,
        categoryId,
        type: type as any,
        amount,
        description,
        userId: user.userId,
        createdAt: date,
      });
    };

    const transactions: Transaction[] = [];

    const year = 2024;

    const month = 6;

    // Determina el número de días en el mes y año dados
    const daysInMonth = new Date(year, month, 0).getDate();

    // Genera transacciones para cada día del mes
    for (let day = 1; day <= daysInMonth; day++) {
      // Crea tres transacciones aleatorias para cada día
      for (let i = 0; i < 3; i++) {
        // Crea una fecha para el día actual del bucle
        const currentDate = new Date(year, month - 1, day);
        // Genera una transacción con la fecha actual
        const transaction = generateRandomTransaction(currentDate);
        transactions.push(transaction);
      }
    }

    // Guarda las transacciones en la base de datos
    await this.transactionRepository.save(transactions);

    return transactions;
  }

  private async validateTransactinValues({
    data,
    queryRunner,
  }: {
    data: CreateTransactionDto;
    user: IUserToken;
    queryRunner: QueryRunner;
  }) {
    const categoryExists = await queryRunner.manager.exists(Category, {
      where: {
        id: data.categoryId,
      },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

    const accountExists = await queryRunner.manager.exists(Account, {
      where: {
        id: data.accountId,
      },
    });

    if (!accountExists) {
      throw new BadRequestException('Account not found');
    }
  }

  private handleError(error: any) {
    console.error(error);
    if (error.code === '23505') {
      throw new BadRequestException('Some value is already in use');
    }

    if (error.code === '23503') {
      throw new BadRequestException('Make sure that the all items exist');
    }

    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.message);
    }

    throw new InternalServerErrorException('Error creating transaction');
  }
}
