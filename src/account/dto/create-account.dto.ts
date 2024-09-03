import { IsEnum, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { AccountType } from '../interfaces/account.interface';

export class CreateAccountDTO {
  @IsNotEmpty()
  name: string;

  // @IsUUID('all')
  // @IsNotEmpty()
  // userId: string;

  @IsNotEmpty()
  @IsEnum(AccountType)
  type: AccountType;
}

export class UpdateAccountDTO extends PartialType(CreateAccountDTO) {}
