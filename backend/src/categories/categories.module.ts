import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

import { CategoryRulesModule } from '../category-rules/category-rules.module';
import { Movement } from '../movements/entities/movement.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    TypeOrmModule.forFeature([Category, Movement]),
    CategoryRulesModule,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
