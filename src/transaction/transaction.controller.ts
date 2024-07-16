import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  HttpCode,
  ParseUUIDPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { BasicFilesInterceptor } from '@/common/interceptors/file';
import { GetUser } from '@/common/decorators/user';
import { IUserToken } from '@/common/interface/userToken';
import {
  FilterTransactionDto,
  GetBalanceDto,
} from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseInterceptors(
    BasicFilesInterceptor({
      sizeInMb: 5,
    }),
  )
  create(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        errorHttpStatusCode: 400,
      }),
    )
    files: Express.Multer.File[],
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: IUserToken,
  ) {
    return this.transactionService.create({
      data: createTransactionDto,
      user,
      files,
    });
  }

  @Post('get-all')
  @HttpCode(200)
  findAll(@GetUser() user: IUserToken, @Body() query: FilterTransactionDto) {
    return this.transactionService.findAll({
      userId: user.userId,
      query,
    });
  }

  @Get('generate-mock-data')
  generateMockData(@GetUser() user: IUserToken) {
    return this.transactionService.insertRandosTransactions(user);
  }

  // META
  @Get('meta/get-min-and-max-date')
  getMinAndMaxTransactionDate(@GetUser() user: IUserToken) {
    return this.transactionService.getMinAndMaxTransactionDate(user);
  }
  @Post('meta/get-balance')
  @HttpCode(200)
  getUserBalances(@GetUser() user: IUserToken, @Body() query: GetBalanceDto) {
    return this.transactionService.getUserBalanceByMonth({
      query,
      user,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionService.findOne(id);
  }

  @Delete(':id')
  deleteOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: IUserToken,
  ) {
    return this.transactionService.deleteOne({
      id,
      user,
    });
  }

  @Patch(':id')
  @UseInterceptors(
    BasicFilesInterceptor({
      sizeInMb: 5,
    }),
  )
  update(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        errorHttpStatusCode: 400,
      }),
    )
    files: Express.Multer.File[],
    @Body() updateTransactionDto: UpdateTransactionDto,
    @GetUser() user: IUserToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.transactionService.update({
      id,
      data: updateTransactionDto,
      user,
      files,
    });
  }
}
