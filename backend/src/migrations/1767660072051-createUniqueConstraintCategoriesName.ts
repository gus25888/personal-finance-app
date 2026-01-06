import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUniqueConstrCategoriesName1767660072051 implements MigrationInterface {
  name = 'CreateUniqueConstrCategoriesName1767660072051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_categories_name_unique_active"
            ON "categories" ("name")
            where "deletedAt" IS NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP UNIQUE INDEX "IDX_categories_name_unique_active"
        `);
  }
}
