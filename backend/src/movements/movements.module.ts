import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { Movement } from './entities/movement.entity';
import { CategoryRulesModule } from '../category-rules/category-rules.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  controllers: [MovementsController],
  providers: [MovementsService],
  imports: [
    TypeOrmModule.forFeature([Movement]),
    CategoriesModule,
    CategoryRulesModule,
    ConfigModule,
  ],
  exports: [MovementsService],
})
export class MovementsModule {}
