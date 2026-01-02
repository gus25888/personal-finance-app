import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { MovementsModule } from './movements/movements.module';
import { CategoryRulesModule } from './category-rules/category-rules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    CategoriesModule,
    MovementsModule,
    CategoryRulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
