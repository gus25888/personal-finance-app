import { IsEnum, IsString, MinLength } from 'class-validator';
import { CategoryType } from '../constants/categories.constants';

export class CreateCategoryDto {
  @IsString({
    message: `"name" must be a string`,
  })
  @MinLength(3)
  name: string;

  @IsEnum(CategoryType, {
    message: `"type" must be a one of these values: '${Object.values(CategoryType).join("','")}'`,
  })
  type: CategoryType;
}
