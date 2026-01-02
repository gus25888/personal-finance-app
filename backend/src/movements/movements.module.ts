import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { Movement } from './entities/movement.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  controllers: [MovementsController],
  providers: [MovementsService],
  imports: [TypeOrmModule.forFeature([Movement]), CategoriesModule],
  exports: [MovementsService],
})
export class MovementsModule {}
