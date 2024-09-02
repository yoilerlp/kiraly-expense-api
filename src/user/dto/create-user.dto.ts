import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  file: any;
}

export class VerifyUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  @MinLength(6)
  otp: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResentOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  otp: string;
}
