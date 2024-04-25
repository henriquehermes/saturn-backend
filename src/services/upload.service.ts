import prisma from '../client';

/**
 * Create the file registry for identification
 * @param {string} file_url
 * @param {string} key
 * @returns {Promise}
 */
const createUploadRegistry = async (file_url: string, key: string) => {
  return await prisma.file.create({
    data: {
      file_url,
      key
    }
  });
};

export default {
  createUploadRegistry
};
