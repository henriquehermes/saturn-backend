import {
	Strategy,
	ExtractJwt,
	StrategyOptions,
	VerifyCallbackWithRequest,
} from "passport-jwt"
import { config } from "./config"
import { tokenTypes } from "./tokens"

const jwtOptions: StrategyOptions = {
	secretOrKey: config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	passReqToCallback: true,
}

const jwtVerify: VerifyCallbackWithRequest = async (req, payload, done) => {
	try {
		if (payload.type !== tokenTypes.ACCESS) {
			throw new Error("Invalid token type")
		}
		const authorization =
			req.headers.authorization !== undefined
				? req.headers.authorization.split(" ")
				: []
		if (authorization[1] === undefined) {
			return done(null, false)
		}

		return done(null)
	} catch (error) {
		return done(error, false)
	}
}

const jwtStrategy = new Strategy(jwtOptions, jwtVerify)

export { jwtStrategy }
