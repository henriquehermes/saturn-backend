import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';
import { User } from '@prisma/client';
import exclude from '../utils/exclude';

const getUser = catchAsync(async (req, res) => {
  const user = req.user as User;

  const userObject = await userService.getUserById(user.id);

  if (!userObject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userWithoutPassword = exclude(userObject, ['password']);

  res.send(userWithoutPassword);
});

const updateUser = catchAsync(async (req, res) => {
  const user = req.user as User;

  const updatedUser = await userService.updateUserById(user.id, req.body);
  res.send(updatedUser);
});

const deleteUser = catchAsync(async (req, res) => {
  const user = req.user as User;

  await userService.deleteUserById(user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const linkGitHub = catchAsync(async (req, res) => {
  const user = req.user as User;

  await userService.linkGitHub(user.id, req.body.github);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  getUser,
  updateUser,
  deleteUser,
  linkGitHub
};
