import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsUUID('all')
  @IsNotEmpty()
  categoryId: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  amountAlert?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  receiveAlert?: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(12)
  @Transform(({ value }) => Number(value))
  month: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(2023)
  @Transform(({ value }) => Number(value))
  year: number;
}
