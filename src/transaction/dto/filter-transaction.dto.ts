import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionType } from '../interface/transaction.interface';
import { OrderBy } from '@/common/interface/pagination';
import { PickType } from '@nestjs/mapped-types';
import { AccountType } from '@/account/interfaces/account.interface';

export class FilterTransactionDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accounts?: string[] = [];

  @IsOptional()
  @IsArray()
  @IsEnum(TransactionType, { each: true })
  type?: TransactionType[] = [];

  @IsOptional()
  @IsISO8601()
  minDate?: string;

  @IsOptional()
  @IsISO8601()
  maxDate?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy;

  @IsOptional()
  @IsArray()
  @IsEnum(AccountType, { each: true })
  accountTypes?: AccountType[] = [];
}

export class FilterTransferDto extends PickType(FilterTransactionDto, [
  'minDate',
  'maxDate',
  'page',
  'limit',
  'orderBy',
]) {}

export class GetBalanceDto {
  // @IsNumber()
  // month: number;

  // @IsNumber()
  // year: number;

  @IsISO8601()
  minDate: string;
  @IsISO8601()
  maxDate: string;
}
