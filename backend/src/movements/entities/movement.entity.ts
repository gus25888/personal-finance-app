import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';

@Entity('movements')
export class Movement {
  @ApiProperty({
    example: 1,
    description: 'Movement ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'Chocolate bar',
    description:
      'Movement Description that contains the human identification of the transaction',
    nullable: false,
  })
  @Column('text', {
    nullable: false,
  })
  description: string;

  @ApiProperty({
    example: '2022-12-05',
    description:
      'Movement Date that indicates the occurrence of the transaction',
    nullable: false,
    format: 'YYYY-MM-DD',
  })
  @Column('date', {
    nullable: false,
  })
  date: Date;

  @ApiProperty({
    example: '1500',
    description: 'Movement Amount of the transaction',
    nullable: false,
  })
  @Column('integer', {
    nullable: false,
  })
  amount: number;

  @ManyToOne<Category>(() => Category, (category) => category.movements, {
    eager: false,
  })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
