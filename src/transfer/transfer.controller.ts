import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { BasicFilesInterceptor } from '@/common/interceptors/file';
import { IUserToken } from '@/common/interface/userToken';
import { GetUser } from '@/common/decorators/user';
import { FilterTransferDto } from '@/transaction/dto/filter-transaction.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @UseInterceptors(
    BasicFilesInterceptor({
      sizeInMb: 5,
    }),
  )
  async create(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        errorHttpStatusCode: 400,
      }),
    )
    files: Express.Multer.File[],
    @GetUser() user: IUserToken,
    @Body() createTransferDto: CreateTransferDto,
  ) {
    return this.transferService.create({
      data: createTransferDto,
      user,
      files,
    });
  }

  @Post('get-all')
  @HttpCode(HttpStatus.OK)
  findAllByUser(@GetUser() user: IUserToken, @Body() query: FilterTransferDto) {
    return this.transferService.findAll({
      query,
      user,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.transferService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransferDto: UpdateTransferDto,
  ) {
    return this.transferService.update(+id, updateTransferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferService.remove(+id);
  }
}
