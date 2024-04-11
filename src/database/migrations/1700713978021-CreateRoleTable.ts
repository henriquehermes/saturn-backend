import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class CreateRoleTable1700713978021 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"users",
			new TableColumn({
				name: "role",
				type: "varchar",
				default: 1,
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("users", "role")
	}
}
