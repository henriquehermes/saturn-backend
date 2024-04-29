import Joi from 'joi';
// import { password } from './custom.validation';

const updateUser = {
  body: Joi.object()
    .keys({
      // email: Joi.string().email(),
      // password: Joi.string().custom(password),
      name: Joi.string(),
      avatar: Joi.string().allow(null),
      github: Joi.string().allow(null)
    })
    .min(1)
};

export default {
  updateUser
};
