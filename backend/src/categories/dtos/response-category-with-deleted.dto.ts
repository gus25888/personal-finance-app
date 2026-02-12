import { ApiProperty } from '@nestjs/swagger';

import { CategoryType } from '../constants/categories.constants';

export class ResponseCategoryWithDeletedDto {
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

  @ApiProperty({
    example: '2025-12-24T03:24:09.430Z',
    description: 'Value that indicates when the category was deleted',
    nullable: true,
    format: 'YYYY-MM-DDThh:mm:ss.sTZD',
  })
  deletedAt: Date | null;
}
