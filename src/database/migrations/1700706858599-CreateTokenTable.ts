import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm"

export class CreateTokenTable1700706858599 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "refresh_tokens",
				columns: [
					{
						name: "id",
						type: "uuid",
						isPrimary: true,
					},
					{
						name: "expiresIn",
						type: "varchar",
					},
					{
						name: "user_id",
						type: "uuid",
					},
				],
				foreignKeys: [
					{
						name: "fk_user_id",
						columnNames: ["user_id"],
						referencedTableName: "users",
						referencedColumnNames: ["id"],
					},
				],
			})
		)

		await queryRunner.addColumn(
			"users",
			new TableColumn({
				name: "refresh_token",
				type: "varchar",
				isNullable: true, // Adjust as needed
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("refresh_tokens")
		await queryRunner.dropColumn("users", "refresh_token")
	}
}
