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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', {
    nullable: false,
  })
  description: string;

  @Column('date', {
    nullable: false,
  })
  date: Date;

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
