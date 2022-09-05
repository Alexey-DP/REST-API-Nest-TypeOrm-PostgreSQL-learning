import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserNameToUsers1662020798407 implements MigrationInterface {
    name = 'AddUserNameToUsers1662020798407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
