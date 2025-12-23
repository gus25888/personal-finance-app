import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsString,
  Max,
  Min,
  MinDate,
  MinLength,
} from 'class-validator';

import {
  MAX_AMOUNT,
  MIN_AMOUNT,
  MIN_DATE,
} from '../constants/movements.constants';

export class CreateMovementDto {
  @IsString()
  @MinLength(5)
  description: string;

  @Type(() => Date)
  @IsDate()
  @MinDate(MIN_DATE)
  date: string;

  @IsInt()
  @Min(MIN_AMOUNT)
  @Max(MAX_AMOUNT)
  amount: number;

  @IsInt()
  @Min(1)
  category: number;
}
