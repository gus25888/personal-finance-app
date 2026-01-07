import { ApiProperty } from '@nestjs/swagger';

import { ResponseCategoryDto } from './response-category.dto';

export class ResponseMovementDto {
  @ApiProperty({
    description: 'Movement Id (Primary Key)',
    nullable: false,
  })
  id: number;

  @ApiProperty({
    description:
      'Movement Description that contains the human identification of the transaction',
    nullable: false,
  })
  description: string;

  @ApiProperty({
    description:
      'Movement Date that indicates the occurrence of the transaction',
    nullable: false,
    format: 'YYYY-MM-DD',
  })
  date: Date;

  @ApiProperty({
    description: 'Movement Amount of the transaction',
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    description: 'Movement Category data',
    nullable: false,
    type: ResponseCategoryDto,
  })
  category: ResponseCategoryDto;

  @ApiProperty({
    description: 'Value that indicates when the movement was created',
    nullable: false,
    format: ' YYYY-MM-DDThh:mm:ss.sTZD',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Value that indicates when the movement was updated',
    nullable: false,
    format: ' YYYY-MM-DDThh:mm:ss.sTZD',
  })
  updatedAt: Date;
}
