import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { CategoryType } from '../constants/categories.constants';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Food',
    description: 'Category Name',
    nullable: false,
    minLength: 3,
  })
  @IsString({
    message: `"name" must be a string`,
  })
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Category Type',
    nullable: false,
    enum: CategoryType,
  })
  @IsEnum(CategoryType, {
    message: `"type" must be a one of these values: '${Object.values(CategoryType).join("','")}'`,
  })
  type: CategoryType;
}
