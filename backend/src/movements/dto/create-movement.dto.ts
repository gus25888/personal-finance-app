import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsString,
  Min,
  MinDate,
  MinLength,
} from 'class-validator';

const MIN_DATE = new Date(2020, 0, 1);

export class CreateMovementDto {
  @IsString()
  @MinLength(5)
  description: string;

  @Type(() => Date)
  @IsDate()
  @MinDate(MIN_DATE)
  date: string;

  @IsInt()
  @Min(500)
  amount: number;

  @IsInt()
  @Min(1)
  category: number;
}
