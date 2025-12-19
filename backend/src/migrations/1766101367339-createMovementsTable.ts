import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMovementsTable1766101367339 implements MigrationInterface {
    name = 'CreateMovementsTable1766101367339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "movements" (
                "id" SERIAL NOT NULL,
                "description" text NOT NULL,
                "date" date NOT NULL,
                "amount" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "categoryId" integer,
                CONSTRAINT "PK_5a8e3da15ab8f2ce353e7f58f67" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "movements"
            ADD CONSTRAINT "FK_0393e858605e7fd71adc8eb70b9" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "movements" DROP CONSTRAINT "FK_0393e858605e7fd71adc8eb70b9"
        `);
        await queryRunner.query(`
            DROP TABLE "movements"
        `);
    }

}
