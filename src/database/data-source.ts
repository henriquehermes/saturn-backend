import "dotenv/config"
import "reflect-metadata"

import { DataSource } from "typeorm"
import { CreateUser1700575212608 } from "./migrations/1700575212608-CreateUser"
import { User } from "../entities/User"
import { CreateTokenTable1700706858599 } from "./migrations/1700706858599-CreateTokenTable"
import { RefreshToken } from "../entities/RefreshToken"
import { CreateRoleTable1700713978021 } from "./migrations/1700713978021-CreateRoleTable"
import { CreateTokenColumnUserTable1700714843319 } from "./migrations/1700714843319-CreateTokenColumnUserTable"

const PORT = process.env.DB_PORT as number | undefined

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	synchronize: false, // DEV_ONLY
	logging: false,
	entities: [User, RefreshToken],
	migrations: [
		CreateUser1700575212608,
		CreateTokenTable1700706858599,
		CreateRoleTable1700713978021,
		CreateTokenColumnUserTable1700714843319,
	],
})
