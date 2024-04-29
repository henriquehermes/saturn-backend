import { User, Role, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (
  email: string,
  password: string,
  name: string,
  role: Role = Role.USER
): Promise<User> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return prisma.user.create({
    data: {
      email,
      name,
      password: await encryptPassword(password),
      role
    }
  });
};

/**
 * Query for users
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.pageSize] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 0)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof User>(
  filter: object,
  options: {
    pageSize?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
    search?: string;
  },
  searchableFields: string[],
  keys: Key[] = [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt',
    'Token',
    'github'
  ] as Key[]
): Promise<{
  users: Pick<User, Key>[];
  pageSize: number;
  totalPages: number;
  page: number;
  totalRows: number;
}> => {
  if (options.search) {
    const searchWord = options.search.toLowerCase(); // Convert search word to lowercase for case-insensitive search
    const searchFilter: { OR: { [key: string]: any }[] } = { OR: [] };

    searchableFields.forEach((field) => {
      const fieldFilter: { [key: string]: any } = {};
      fieldFilter[field] = {
        contains: searchWord,
        mode: 'insensitive'
      };
      searchFilter.OR.push(fieldFilter);
    });
    // Combine the search filter with the existing filter
    filter = { AND: [filter, searchFilter] };
  }
  const totalCount = await prisma.user.count({ where: filter });
  const page = options.page ?? 0;
  const pageSize = options.pageSize ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const totalPages = Math.ceil(totalCount / pageSize);

  const users = await prisma.user.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * pageSize,
    take: pageSize,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return { users: users as Pick<User, Key>[], pageSize, totalPages, page, totalRows: totalCount };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserById = async <Key extends keyof User>(
  id: string,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt',
    'github',
    'avatar',
    'favourites'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt',
    'github'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async <Key extends keyof User>(
  userId: string,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = ['id', 'email', 'name', 'role', 'avatar', 'github'] as Key[]
): Promise<Pick<User, Key> | null> => {
  const user = await getUserById(userId, ['id', 'email', 'name']);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await getUserByEmail(updateBody.email as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedUser as Pick<User, Key> | null;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: string): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await prisma.user.delete({ where: { id: user.id } });
  return user;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
};
