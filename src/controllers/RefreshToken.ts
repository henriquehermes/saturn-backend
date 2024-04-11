import { Request, Response } from "express"
import { RefreshTokenService } from "../services/Token"
import { tokenSchema } from "../schemas/TokenSchema"

export class RefreshTokenController {
	async handle(request: Request, response: Response) {
		const { refreshToken } = request.body

		const { error } = tokenSchema.validate(refreshToken)

		if (error) {
			return response.status(400).json({ error: "Invalid property value" })
		}

		const service = new RefreshTokenService()

		const result = await service.execute(refreshToken)

		if (result instanceof Error) {
			return response.status(400).json({ error: result.message })
		}

		return response.status(201).json(result)
	}
}
