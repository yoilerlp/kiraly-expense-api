import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class FilterBudgetsDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(2023)
  year: number;
}
