/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { Transfer } from './entities/transfer.entity';
import {
  Between,
  DataSource,
  FindOneOptions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '@/file/file.service';
import { TransferFile } from '@/entities';
import { IUserToken } from '@/common/interface/userToken';
import { FilterTransferDto } from '@/transaction/dto/filter-transaction.dto';
import { generateSortBasicFilter } from '@/common/helper/filter';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private transferRepository: Repository<Transfer>,
    @InjectRepository(TransferFile)
    private transferFileRepository: Repository<TransferFile>,
    private dataSource: DataSource,
    private fileService: FileService,
  ) {}

  async create({
    data,
    user,
    files,
  }: {
    data: CreateTransferDto;
    user: IUserToken;
    files: Express.Multer.File[];
  }) {
    if (data.destinationAccountId === data.originAccountId) {
      throw new BadRequestException(
        'Origin and destination accounts cannot be the same',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let filesUploaded: Awaited<
      ReturnType<typeof this.fileService.uploadFileToStore>
    >[] = [];

    try {
      const transfer = this.transferRepository.create({
        ...data,
        userId: user.userId,
      });
      await queryRunner.manager.save(transfer);

      // upload files
      if (files && files.length > 0) {
        filesUploaded =
          await this.fileService.uploadMultiplesFilesToStore(files);
        await queryRunner.manager.save(filesUploaded);

        // create transfer file items
        const transferFilesCreated = this.transferFileRepository.create(
          filesUploaded.map((file) => ({
            transfer,
            file,
          })),
        );

        await queryRunner.manager.save(transferFilesCreated);
      }
      await queryRunner.commitTransaction();

      return transfer;
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

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll({
    user,
    query,
  }: {
    user: IUserToken;
    query: FilterTransferDto;
  }) {
    const { limit = 10, page = 1, orderBy } = query || {};

    const orderResultBy = generateSortBasicFilter({
      orderBy,
    });

    const skip = Number(page - 1) * Number(limit) || 0;

    const take = Number(limit) || 10;

    const whereOptions: FindOneOptions<Transfer>['where'] = {
      userId: user.userId,
    };
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

    const [result, total] = await this.transferRepository.findAndCount({
      where: whereOptions,
      order: orderResultBy,
      skip,
      take,
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
    const transfer = await this.transferRepository.findOne({
      where: { id },
      relations: ['originAccount', 'destinationAccount', 'transferFiles'],
    });

    if (!transfer) {
      throw new BadRequestException('Transfer not found');
    }

    return transfer;
  }

  update(id: number, updateTransferDto: UpdateTransferDto) {
    return `This action updates a #${id} transfer`;
  }

  remove(id: number) {
    return `This action removes a #${id} transfer`;
  }
}
