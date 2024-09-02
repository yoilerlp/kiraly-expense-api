import { IsISO8601 } from 'class-validator';

export class ReportsParamsDto {
  @IsISO8601()
  minDate: string;

  @IsISO8601()
  maxDate: string;
}
