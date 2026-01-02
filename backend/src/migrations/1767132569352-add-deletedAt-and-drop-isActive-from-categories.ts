import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtAndDropIsActiveFromCategories1767132569352 implements MigrationInterface {
    name = 'AddDeletedAtAndDropIsActiveFromCategories1767132569352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "categories"
                RENAME COLUMN "isActive" TO "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "categories" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "categories"
            ADD "deletedAt" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "categories" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "categories"
            ADD "deletedAt" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "categories"
                RENAME COLUMN "deletedAt" TO "isActive"
        `);
    }

}
