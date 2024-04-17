import Joi from 'joi';
import { password } from './custom.validation';

const updateUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string()
    })
    .min(1)
};

const githubLink = {
  body: Joi.object().keys({
    github: Joi.string()
      .regex(/^https:\/\/api\.github\.com\/users\/.+/)
      .allow(null)
  })
};

export default {
  updateUser,
  githubLink
};
