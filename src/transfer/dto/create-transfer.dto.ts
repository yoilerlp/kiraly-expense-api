import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsNotEmpty()
  @IsUUID('all')
  originAccountId: string;

  @IsNotEmpty()
  @IsUUID('all')
  destinationAccountId: string;

  @IsOptional()
  files: any
}
