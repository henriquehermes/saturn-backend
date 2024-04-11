import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { GetUserService } from "../services/User"

export function authentication(
	request: Request,
	response: Response,
	next: NextFunction
) {
	const authToken = request.headers.authorization

	if (!authToken) {
		return response.status(401).json({
			message: "Invalid authorization",
		})
	}

	const [, token] = authToken.split(" ")

	try {
		verify(token, "cake-doggy-millie")
		return next()
	} catch (error) {
		return response.status(401).json({ message: error })
	}
}

export function isAdmin() {
	return async (request: Request, response: Response, next: NextFunction) => {
		const authToken = request.headers.authorization

		if (!authToken) {
			return response.status(401).json({
				message: "Invalid authorization",
			})
		}

		const [, token] = authToken.split(" ")

		const service = new GetUserService()
		const user = await service.execute({ token: token ?? "" })

		if (user instanceof Error) {
			return response.status(400).json({ error: user.message })
		}

		if (user.role !== "2") {
			return response.status(401).json({ message: "Not authorized" })
		}
		return next()
	}
}
