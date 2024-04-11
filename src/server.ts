/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import "reflect-metadata"

import express from "express"
import cors from "cors"

import { AppDataSource } from "./database/data-source"
import { routes } from "./routes"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import morgan from "morgan"
import passport from "passport"
import { jwtStrategy } from "./configs/passport"
import fourOhFour from "./middleware/fourOhFour"
import errorHandler from "./middleware/errorHandler"

AppDataSource.initialize().then(() => {
	const app = express()

	app.use(
		cors({
			origin: "*",
		})
	)

	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.use(cookieParser())

	app.use(helmet())
	app.use(morgan("tiny"))

	// jwt authentication
	passport.use("jwt", jwtStrategy)
	app.use(passport.initialize())

	app.use(routes)

	const PORT = process.env.PORT || 3000

	app.listen(PORT, () => {
		console.log(`🚀 Backend listening at http://localhost:${PORT} 🚀`)
	})

	// Apply error handling last
	app.use(fourOhFour)
	app.use(errorHandler)
})
