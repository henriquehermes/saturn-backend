import catchAsync from '../utils/catchAsync';
import { favouriteService } from '../services';
import { User } from '@prisma/client';

const addFavourite = catchAsync(async (req, res) => {
  const user = req.user as User;
  const favouriteList = req.body['favourites'];

  const updatedFavourites = await favouriteService.updateFavourites(user.id, favouriteList);

  res.send(updatedFavourites);
});

const getFavourites = catchAsync(async (req, res) => {
  const user = req.user as User;

  const updatedFavourites = await favouriteService.getFavourites(user.id);

  res.send(updatedFavourites);
});

export default {
  addFavourite,
  getFavourites
};
