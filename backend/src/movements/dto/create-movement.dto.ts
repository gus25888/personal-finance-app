import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDivisibleBy,
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
  @ApiProperty({
    example: 'Chocolate bar',
    description:
      'Movement Description that contains the human identification of the transaction',
    nullable: false,
    minLength: 5,
  })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiProperty({
    example: '2022-12-05',
    description:
      'Movement Date that indicates the occurrence of the transaction',
    nullable: false,
    format: 'YYYY-MM-DD',
  })
  @Type(() => Date)
  @IsDate()
  @MinDate(MIN_DATE)
  date: Date;

  @ApiProperty({
    example: 1500,
    description: 'Movement Amount of the transaction',
    nullable: false,
    minimum: MIN_AMOUNT,
    maximum: MAX_AMOUNT,
    multipleOf: 500,
  })
  @IsInt()
  @Min(MIN_AMOUNT)
  @Max(MAX_AMOUNT)
  @IsDivisibleBy(500)
  amount: number;

  @ApiProperty({
    example: 3,
    description:
      'Movement Category of the transaction (foreign key of Category table)',
    nullable: false,
  })
  @IsInt()
  @Min(1)
  category: number;
}
