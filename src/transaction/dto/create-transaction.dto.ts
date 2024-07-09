import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../interface/transaction.interface';
import { Transform } from 'class-transformer';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsNotEmpty()
  @IsUUID('all')
  accountId: string;

  @IsUUID('all')
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  files: any
}
