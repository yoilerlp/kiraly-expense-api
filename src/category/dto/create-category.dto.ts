import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  mainColor: string;

  @IsString()
  @IsNotEmpty()
  subColor: string;

  @IsString()
  @IsNotEmpty()
  icon: string;
}
