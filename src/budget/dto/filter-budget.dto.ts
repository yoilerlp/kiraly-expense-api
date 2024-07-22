import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FilterBudgetsDto {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsOptional()
  @Min(2023)
  year?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(12)
  @Transform(({ value }) => Number(value))
  month?: number;
}
