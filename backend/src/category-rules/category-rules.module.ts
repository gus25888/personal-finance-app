import { Module } from '@nestjs/common';

import { CategoryRulesService } from './category-rules.service';

@Module({
  imports: [],
  providers: [CategoryRulesService],
  exports: [CategoryRulesService],
})
export class CategoryRulesModule {}
