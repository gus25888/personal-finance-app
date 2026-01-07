import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryRulesService } from './category-rules.service';
import { Category } from '../categories/entities/category.entity';
import { Movement } from '../movements/entities/movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Movement])],
  providers: [CategoryRulesService],
  exports: [CategoryRulesService],
})
export class CategoryRulesModule {}
