import prisma from '../client';

/**
 * Update user's favourite projects
 * @param {string} userId
 * @param {string[]} favourites
 * @returns {Promise<{ name: string; logo: string | null }[]>}
 */
const updateFavourites = async (
  userId: string,
  favourites: string[]
): Promise<{ name: string; logo: string | null }[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { favourites: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { favourites },
    select: { favourites: true }
  });

  return getFavourites(userId);
};

/**
 * Fetch user's favourite projects
 * @param {string} userId
 * @returns {Promise<{ name: string; logo: string | null }[]>}
 */
const getFavourites = async (userId: string): Promise<{ name: string; logo: string | null }[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { favourites: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const projects = await prisma.project.findMany({
    where: {
      name: {
        in: user.favourites
      }
    },
    select: {
      name: true,
      logo: true
    }
  });

  return projects.map((project) => ({
    name: project.name,
    logo: project.logo
  }));
};

export default {
  updateFavourites,
  getFavourites
};
