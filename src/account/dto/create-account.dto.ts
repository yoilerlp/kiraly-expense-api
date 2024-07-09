import { IsEnum, IsNotEmpty } from 'class-validator';
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
