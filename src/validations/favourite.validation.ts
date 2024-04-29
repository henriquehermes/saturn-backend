import Joi from 'joi';

const addFavourite = {
  body: Joi.object().keys({
    favourites: Joi.array().items(Joi.string()).required()
  })
};

export default {
  addFavourite
};
