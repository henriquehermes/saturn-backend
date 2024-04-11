import dayjs from "dayjs"
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository"
import { sign } from "jsonwebtoken"
import { UserRepository } from "../repositories/UserRepository"

class GenerateTokenService {
	async execute(userId: string) {
		const token = await sign({}, "cake-doggy-millie", {
			subject: userId,
			expiresIn: "180 days",
		})

		await UserRepository.update({ id: userId }, { token })

		return token
	}
}

class GenerateRefreshTokenService {
	async execute(userId: string) {
		const expiresIn = dayjs().add(180, "days").unix()

		await RefreshTokenRepository.delete({
			user_id: userId,
		})

		const generateRefreshToken = await RefreshTokenRepository.create({
			expiresIn,
			user_id: userId,
		})

		await UserRepository.update(
			{ id: userId },
			{ refresh_token: generateRefreshToken.id }
		)

		await RefreshTokenRepository.save(generateRefreshToken)

		return generateRefreshToken
	}
}

class RefreshTokenService {
	async execute(refresh_token: string) {
		const refreshToken = await RefreshTokenRepository.findOneBy({
			id: refresh_token,
		})

		if (!refreshToken) {
			return new Error("Couldn't find refresh token")
		}

		const refreshTokenExpired = dayjs().isAfter(
			dayjs.unix(refreshToken.expiresIn)
		)

		const generateToken = new GenerateTokenService()
		const token = await generateToken.execute(refreshToken.user_id)

		if (refreshTokenExpired) {
			const generateRefreshToken = new GenerateRefreshTokenService()
			const newRefreshToken = await generateRefreshToken.execute(
				refreshToken.user_id
			)

			return { token, newRefreshToken }
		}

		return { token }
	}
}

export {
	GenerateRefreshTokenService,
	RefreshTokenService,
	GenerateTokenService,
}
