import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryRulesService } from './category-rules.service';
import { Movement } from '../movements/entities/movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movement])],
  providers: [CategoryRulesService],
  exports: [CategoryRulesService],
})
export class CategoryRulesModule {}
