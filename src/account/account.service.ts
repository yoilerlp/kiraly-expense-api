import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDTO } from './dto/create-account.dto';
import { IUserToken } from '@/common/interface/userToken';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
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

  private handleError(error: any) {
    console.error(error);
    if (error.code === '23503') {
      throw new BadRequestException('Make sure that the user exists');
    }

    throw new InternalServerErrorException('Server error');
  }
}
