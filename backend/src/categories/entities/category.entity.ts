import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Movement } from '../../movements/entities/movement.entity';
import { CategoryType } from '../constants/categories.constants';

@Entity('categories')
export class Category {
  @ApiProperty({
    example: 1,
    description: 'Category ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'Food',
    description: 'Category Name',
    nullable: false,
  })
  @Column('text', {
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Category Type',
    nullable: false,
    enum: CategoryType,
  })
  @Column('text', {
    nullable: false,
  })
  type: string;

  @ApiProperty({
    description: 'Category isActive value',
    default: true,
  })
  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @OneToMany<Movement>(() => Movement, (movement) => movement.category)
  movements: Movement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
