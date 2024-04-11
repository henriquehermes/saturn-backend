import { AppDataSource } from "../database/data-source"
import { RefreshToken } from "../entities/RefreshToken"

export const RefreshTokenRepository = AppDataSource.getRepository(RefreshToken)
