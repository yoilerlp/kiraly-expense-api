import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Not, Repository } from 'typeorm';
import { CreateAccountDTO, UpdateAccountDTO } from './dto/create-account.dto';
import { IUserToken } from '@/common/interface/userToken';
import { TransactionService } from '@/transaction/transaction.service';
import { AccountType } from './interfaces/account.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly transactionService: TransactionService,
  ) {}

  async createAccount(data: CreateAccountDTO, user: IUserToken) {
    try {
      const account = this.accountRepository.create({
        ...data,
        userId: user.userId,
      });
      await this.accountRepository.save(account);
      return account;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllAcountsByUserId({
    userId,
    type,
  }: {
    userId: string;
    type?: AccountType;
  }) {
    const isValidType = Object.values(AccountType).includes(type);

    return await this.accountRepository.find({
      where: {
        userId,
        type: isValidType ? type : Not(AccountType.LOAN),
      },
    });
  }

  async getAllLoanAccountsWithBalanceByUserId({ userId }: { userId: string }) {
    const accounts = await this.accountRepository.find({
      where: {
        userId,
        type: AccountType.LOAN,
      },
    });

    const accountsWithBalancePromises = accounts.map(async (account) => {
      const balance = await this.transactionService.getAccountBalanceByUser({
        userId,
        accountId: account.id,
      });

      return {
        account,
        balance,
      };
    });

    return Promise.all(accountsWithBalancePromises);
  }

  async getAccountWithBalanceById({
    accountId,
    userId,
  }: {
    accountId: string;
    userId: string;
  }) {
    const account = await this.accountRepository.findOne({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const balance = await this.transactionService.getAccountBalanceByUser({
      userId,
      accountId,
    });

    return {
      account,
      balance,
    };
  }
  async updateAccountById({
    accountId,
    userId,
    data,
  }: {
    accountId: string;
    userId: string;
    data: UpdateAccountDTO;
  }) {
    const account = await this.accountRepository.findOne({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!account || account.userId !== userId) {
      throw new BadRequestException('Account not found');
    }

    await this.accountRepository.update(accountId, data);

    return {
      ...account,
      ...data,
    };
  }

  private handleError(error: any) {
    console.error(error);
    if (error.code === '23503') {
      throw new BadRequestException('Make sure that the user exists');
    }

    throw new InternalServerErrorException('Server error');
  }
}
