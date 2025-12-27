import { ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { CategoryType } from '../../categories/constants/categories.constants';
import { Category } from '../../categories/entities/category.entity';

export class QueryMovementDto {
  @ApiPropertyOptional({
    example: 3,
    description: 'Movement Category (foreign key)',
    oneOf: [{ $ref: getSchemaPath(Category) }],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category?: number;

  @ApiPropertyOptional({
    example: '2023-12-18',
    description: 'Lower bound date to search for',
    format: 'YYYY-MM-DD',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromDate?: Date;

  @ApiPropertyOptional({
    example: '2025-12-18',
    description: 'Upper bound date to search for',
    format: 'YYYY-MM-DD',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toDate?: Date;

  // TODO: Agregar regexp, ya que buscaré por partes del texto. Además, que sea case insensitive.
  @ApiPropertyOptional({
    example: 'Chocolate bar',
    description: 'Movement Description to search for',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Category Type',
    enum: CategoryType,
  })
  @IsOptional()
  @IsEnum(CategoryType, {
    message: `"categoryType" must be one of these values: '${Object.values(CategoryType).join("','")}'`,
  })
  categoryType?: CategoryType;
}
