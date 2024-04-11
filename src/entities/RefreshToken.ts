import { Entity, Column, PrimaryColumn } from "typeorm"
import { v4 as uuid } from "uuid"

@Entity("refresh_tokens")
export class RefreshToken {
	@PrimaryColumn({ type: "varchar" })
	id: string

	@Column({ type: "numeric" })
	expiresIn: number

	@Column({ type: "varchar" })
	user_id: string

	constructor() {
		if (!this.id) {
			this.id = uuid()
		}
	}
}
