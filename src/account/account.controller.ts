import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { GetUser } from '../common/decorators/user';
import { IUserToken } from '@/common/interface/userToken';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  getAllByUser(@GetUser() user: IUserToken) {
    return this.accountService.getAllAcountsByUserId(user.userId);
  }

  @Post()
  createAccount(@Body() body: CreateAccountDTO, @GetUser() user: any) {
    return this.accountService.createAccount(body, user);
  }
}
