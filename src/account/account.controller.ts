import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDTO, UpdateAccountDTO } from './dto/create-account.dto';
import { GetUser } from '../common/decorators/user';
import { IUserToken } from '@/common/interface/userToken';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  getAllByUser(@GetUser() user: IUserToken, @Query() query: any) {
    return this.accountService.getAllAcountsByUserId({
      userId: user.userId,
      type: query?.type,
    });
  }

  @Post()
  createAccount(@Body() body: CreateAccountDTO, @GetUser() user: any) {
    return this.accountService.createAccount(body, user);
  }

  @Get('loan')
  getAllLoanAccountsWithBalanceByUserId(@GetUser() user: IUserToken) {
    return this.accountService.getAllLoanAccountsWithBalanceByUserId({
      userId: user.userId,
    });
  }

  @Get(':id')
  getAccountWithBalanceById(
    @GetUser() user: IUserToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.accountService.getAccountWithBalanceById({
      accountId: id,
      userId: user.userId,
    });
  }
  @Patch(':id')
  updateUserAccount(
    @GetUser() user: IUserToken,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateAccountDTO,
  ) {
    return this.accountService.updateAccountById({
      accountId: id,
      userId: user.userId,
      data: body,
    });
  }
}
