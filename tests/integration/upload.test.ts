import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { insertUsers, userOne } from '../fixtures/user.fixture';
import { tokenService } from '../../src/services';
import prisma from '../../src/client';
import { User } from '@prisma/client';

describe('File Upload API Integration Test', () => {
  let token = ''; // Access token

  beforeAll(async () => {
    await insertUsers([userOne]);
    const dbUserOne = (await prisma.user.findUnique({ where: { email: userOne.email } })) as User;

    // Generate an access token
    const userOneAccessToken = await tokenService.generateAuthTokens({ id: dbUserOne.id });

    token = userOneAccessToken.access.token;
  });

  describe('POST /r2', () => {
    it('should upload a file to R2', async () => {
      const file = {
        fieldname: 'file',
        originalname: 'test.txt',
        buffer: Buffer.from('Test file content')
      };

      const response = await request(app)
        .post('/v1/upload/r2')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', file.buffer, file.originalname);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body.image).toBeTruthy(); // Check if image URL is returned
    });
  });

  describe('POST /local', () => {
    it('should upload a file locally', async () => {
      const file = {
        fieldname: 'file',
        originalname: 'test.txt',
        buffer: Buffer.from('Test file content')
      };

      const response = await request(app)
        .post('/v1/upload/local')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', file.buffer, file.originalname);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body.url).toBeTruthy(); // Check if URL is returned
    });
  });

  describe('POST /', () => {
    it('should upload a file to S3', async () => {
      const file = {
        fieldname: 'file',
        originalname: 'test.txt',
        buffer: Buffer.from('Test file content')
      };

      const response = await request(app)
        .post('/v1/upload/')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', file.buffer, file.originalname);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body.url).toBeTruthy(); // Check if URL is returned
    });
  });

  describe('DELETE /', () => {
    it('should delete a file from S3', async () => {
      const file = {
        fieldname: 'file',
        originalname: 'test.txt',
        buffer: Buffer.from('Test file content')
      };

      // Upload the file first
      const uploadResponse = await request(app)
        .post('/v1/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', file.buffer, file.originalname);

      const key = uploadResponse.body.url.split('/').pop(); // Extract key from the URL

      // Delete the uploaded file
      const deleteResponse = await request(app)
        .delete(`/v1/upload?key=${key}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteResponse.status).toBe(httpStatus.OK);
    });
  });
});
