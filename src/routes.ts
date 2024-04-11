import { Router } from "express"

import {
	LoginUserController,
	CreateUserController,
	GetUserController,
	UpdateUserController,
	LogoutUserController,
} from "./controllers/User"
import { authentication } from "./middleware/authentication"
import { RefreshTokenController } from "./controllers/RefreshToken"

export const routes = Router()

routes.post("/v1/user", new CreateUserController().handle)
routes.post("/v1/login", new LoginUserController().handle)

// ***** ADMIN ROUTES *****

routes.get("/v1/user", authentication, new GetUserController().handle)
routes.put("/v1/user/:id", authentication, new UpdateUserController().handle)

routes.post(
	"/v1/refresh-token",
	authentication,
	new RefreshTokenController().handle
)

routes.post("/v1/logout", new LogoutUserController().handle)
