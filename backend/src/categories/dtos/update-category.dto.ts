import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { CategoryType } from '../constants/categories.constants';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Food',
    description: 'Category Name',
    nullable: false,
    minLength: 3,
    uniqueItems: true,
  })
  @IsOptional()
  @IsString({
    message: `'name' must be a string`,
  })
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional({
    description: 'Category Type',
    nullable: false,
    enum: CategoryType,
  })
  @IsOptional()
  @IsEnum(CategoryType, {
    message: `'type' must be a one of these values: '${Object.values(CategoryType).join("','")}'`,
  })
  type?: CategoryType;
}
