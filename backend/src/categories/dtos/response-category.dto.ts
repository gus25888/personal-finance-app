import { ApiProperty } from '@nestjs/swagger';

import { CategoryType } from '../constants/categories.constants';

export class ResponseCategoryDto {
  @ApiProperty({
    description: 'Category Id (Primary Key)',
    nullable: false,
  })
  id: number;

  @ApiProperty({
    description: 'Category Name',
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Category Type',
    nullable: false,
    enum: CategoryType,
  })
  type: CategoryType;
}
