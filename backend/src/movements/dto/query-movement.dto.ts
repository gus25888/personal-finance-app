import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { CategoryType } from '../../categories/constants/categories.constants';

export class QueryMovementDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toDate?: Date;

  // TODO: Agregar regexp, ya que buscaré por partes del texto. Además, que sea case insensitive.
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CategoryType, {
    message: `"categoryType" must be one of these values: '${Object.values(CategoryType).join("','")}'`,
  })
  categoryType?: CategoryType;
}
