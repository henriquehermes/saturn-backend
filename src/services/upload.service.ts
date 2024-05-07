import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import prisma from '../client';
import config from '../config/config';
import { s3 } from '../lib/cloud-bucket';
import logger from '../config/logger';
import { File } from '@prisma/client';

/**
 * Create the file registry for identification
 * @param {string} file_url - URL of the file
 * @param {string} key - Unique key of the file
 * @returns {Promise<File>}
 */
const createUploadRegistry = async (file_url: string, key: string): Promise<File> => {
  return await prisma.file.create({
    data: {
      file_url,
      key
    }
  });
};

/**
 * Delete the file registry and associated file from storage
 * @param {string} file_url - URL of the file
 * @returns {Promise<void>}
 */
const deleteRegistry = async (file_url: string): Promise<void> => {
  const file = await prisma.file.findFirst({
    where: {
      file_url
    }
  });

  if (!file) {
    logger.error('Could not find file registry');
    throw new Error('File not found');
  }

  const fileKey = file.key;
  await prisma.file.delete({
    where: {
      file_url
    }
  });

  const params = { Bucket: config.aws.bucket, Key: fileKey };
  const deleteCommand = new DeleteObjectCommand(params);
  await s3.send(deleteCommand);
};

export default {
  createUploadRegistry,
  deleteRegistry
};
