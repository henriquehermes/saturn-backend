import Joi from "joi"

const tokenSchema = Joi.string().guid({
	version: ["uuidv4"],
})

export { tokenSchema }
