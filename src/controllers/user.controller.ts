import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { tokenService, userService } from '../services';
import exclude from '../utils/exclude';

const getToken = async (bearerToken: string) => {
  if (bearerToken) {
    bearerToken = bearerToken.split(' ')[1];
  }

  const accessToken = await tokenService.verifyAccessToken(bearerToken);
  const { userId } = accessToken;
  return userId;
};

const getUserSession = catchAsync(async (req, res) => {
  const userId = await getToken(req.headers.authorization ?? '');

  const user = await userService.getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const userWithoutPassword = exclude(user, ['password']);

  res.send(userWithoutPassword);
});

const updateUser = catchAsync(async (req, res) => {
  const userId = await getToken(req.headers.authorization ?? '');
  const user = await userService.updateUserById(userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const userId = await getToken(req.headers.authorization ?? '');
  await userService.deleteUserById(userId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  getUserSession,
  updateUser,
  deleteUser
};
