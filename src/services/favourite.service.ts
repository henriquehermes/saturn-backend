import prisma from '../client';

/**
 * Add favourite project to the navbar
 * @param {string} userId
 * @param {favourites[]} projectNames
 * @returns {Promise<string[]>}
 */
const addFavourite = async (
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

  const projects = await prisma.project.findMany({
    where: {
      name: {
        in: favourites
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

/**
 * Get favourite list from user
 * @param {string} userId
 * @returns {Promise<string[]>}
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
  addFavourite,
  getFavourites
};
