import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { tokenService, userService } from '../services';
import exclude from '../utils/exclude';

const createUser = catchAsync(async (req, res) => {
  const { email, password, name, role } = req.body;
  const user = await userService.createUser(email, password, name, role);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'search', 'sortType']);
  const searching = req.query['searchKey'] as string;
  const searchFields = searching ? searching.split(',').map((field) => field.trim()) : [];
  const result = await userService.queryUsers(filter, options, searchFields);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getUserSession = catchAsync(async (req, res) => {
  let bearerToken = req.headers.authorization ?? '';

  if (bearerToken) {
    bearerToken = bearerToken.split(' ')[1];
  }
  const accessToken = await tokenService.verifyAccessToken(bearerToken);
  const { userId } = accessToken;

  const user = await userService.getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const userWithoutPassword = exclude(user, ['password']);

  res.send(userWithoutPassword);
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserSession
};
