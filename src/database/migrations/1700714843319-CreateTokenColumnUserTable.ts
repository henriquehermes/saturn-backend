import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class CreateTokenColumnUserTable1700714843319
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"users",
			new TableColumn({
				name: "token",
				type: "varchar",
				isNullable: true,
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("users", "token")
	}
}
