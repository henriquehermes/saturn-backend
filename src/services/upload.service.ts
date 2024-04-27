import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import prisma from '../client';
import config from '../config/config';
import { s3 } from '../lib/cloud-bucket';
import logger from '../config/logger';

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

const deleteRegistry = async (file_url: string) => {
  const hasFile = await prisma.file.findFirst({
    where: {
      file_url
    }
  });

  if (!hasFile) {
    logger.error('Could not find file registry');
    return 'File not found';
  }

  const fileKey = await prisma.file.delete({
    where: {
      file_url
    }
  });

  const params = { Bucket: config.aws.bucket, Key: fileKey.key };
  const deleteCommand = new DeleteObjectCommand(params);
  await s3.send(deleteCommand);
};

export default {
  createUploadRegistry,
  deleteRegistry
};
