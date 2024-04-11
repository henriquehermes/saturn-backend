import { User } from "../entities/User"
import { IRefreshToken } from "../interfaces/TokenInterfaces"
import { IUser } from "../interfaces/UserInterfaces"
import { UserRepository } from "../repositories/UserRepository"
import bcrypt from "bcrypt"
import { GenerateRefreshTokenService, GenerateTokenService } from "./Token"
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository"

export class CreateUserService {
	async execute({
		email,
		first_name,
		last_name,
		password,
	}: Pick<IUser, "email" | "first_name" | "last_name" | "password">): Promise<
		User | Error
	> {
		if (await UserRepository.findOneBy({ email })) {
			return new Error("User already exists")
		}

		if (!email) {
			return new Error("Email is required")
		}

		const encrypted = await bcrypt.hash(password, 10)

		const User = UserRepository.create({
			email,
			first_name,
			last_name,
			password: encrypted,
		})

		await UserRepository.save(User)

		//@ts-ignore
		delete User.password

		return User
	}
}

export class UpdateUserService {
	async execute({
		id,
		email,
		first_name,
		last_name,
	}: Pick<IUser, "id" | "email" | "first_name" | "last_name">): Promise<
		User | Error
	> {
		const user = await UserRepository.findOneBy({ id })

		if (!user) {
			return new Error("User not found")
		}
		user.email = email ?? user.email
		user.first_name = first_name ?? user.first_name
		user.last_name = last_name ?? user.last_name
		user.role = "1"

		await UserRepository.save(user)

		//@ts-ignore
		delete user.password

		return user
	}
}

export class LoginUserService {
	async execute({
		email,
		password,
	}: Pick<IUser, "password" | "email">): Promise<
		Partial<IUser & { token: string; refreshToken: IRefreshToken }> | Error
	> {
		const user = await UserRepository.findOneBy({ email })
		if (!user) {
			return new Error("User or Password is incorrect")
		}

		const passwordMatch = await bcrypt.compare(password, user.password)
		if (!passwordMatch) {
			return new Error("User or Password is incorrect")
		}

		const generateToken = new GenerateTokenService()
		const token = await generateToken.execute(user.id)

		const generateRefreshToken = new GenerateRefreshTokenService()
		const refreshToken = await generateRefreshToken.execute(user.id)

		//@ts-ignore
		delete user["password"]

		return { ...user, token, refreshToken }
	}
}

export class GetUserService {
	async execute({ token }: { token: string }): Promise<IUser | Error> {
		const user = await UserRepository.findOneBy({ token })
		if (!user) {
			return new Error("User not found")
		}

		//@ts-ignore
		delete user["password"]

		return user
	}
}

export class LogoutUserService {
	async execute({ token }: { token: string }): Promise<boolean | Error> {
		const user = await UserRepository.findOneBy({ token })

		if (!user) {
			return new Error("User not found")
		}

		user.token = null
		user.refresh_token = null

		await RefreshTokenRepository.delete({
			user_id: user.id,
		})

		await UserRepository.save(user)

		return true
	}
}
