import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

import { CategoryRulesModule } from '../category-rules/category-rules.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [TypeOrmModule.forFeature([Category]), CategoryRulesModule],
  exports: [CategoriesService],
})
export class CategoriesModule {}
