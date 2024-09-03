import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDTO, UpdateAccountDTO } from './dto/create-account.dto';
import { IUserToken } from '@/common/interface/userToken';
import { TransactionService } from '@/transaction/transaction.service';

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

  async getAllAcountsByUserId(userId: string) {
    return await this.accountRepository.find({
      where: {
        userId,
      },
    });
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
