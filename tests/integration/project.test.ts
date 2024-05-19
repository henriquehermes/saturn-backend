import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { insertUsers, userOne } from '../fixtures/user.fixture';
import { tokenService } from '../../src/services';
import prisma from '../../src/client';
import { User } from '@prisma/client';

describe('Project API Integration Test', () => {
  let token = ''; // Access token

  beforeAll(async () => {
    await insertUsers([userOne]);
    const dbUserOne = (await prisma.user.findUnique({ where: { email: userOne.email } })) as User;

    // Generate an access token
    const userOneAccessToken = await tokenService.generateAuthTokens({ id: dbUserOne.id });

    token = userOneAccessToken.access.token;
  });

  describe('POST /project', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        design_url: 'https://example.com/design',
        flow_diagram: 'https://example.com/diagram',
        logo: 'https://example.com/logo'
      };

      const response = await request(app)
        .post('/v1/project/new')
        .set('Authorization', `Bearer ${token}`)
        .send(projectData);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body.name).toBe('Test Project');
      expect(response.body.description).toBe('Test Description');
      // Add more expectations based on your project schema
    });
  });

  describe('GET /project', () => {
    it('should get all project', async () => {
      const response = await request(app)
        .get('/v1/project')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      // Add expectations for the response body
    });
  });

  describe('GET /project/stats', () => {
    it('should get project statistics', async () => {
      const response = await request(app)
        .get('/v1/project/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      // Add expectations for the response body
    });
  });

  describe('GET /project/:name', () => {
    it('should get project by name', async () => {
      const projectName = encodeURIComponent('Test Project'); // Encode project name

      const response = await request(app)
        .get(`/v1/project/${projectName}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      // Add expectations for the response body
    });
  });

  describe('DELETE /project/:id', () => {
    it('should delete a project', async () => {
      // Create a project first
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        design_url: 'https://example.com/design',
        flow_diagram: 'https://example.com/diagram',
        logo: 'https://example.com/logo'
      };

      const createResponse = await request(app)
        .post('/v1/project/new')
        .set('Authorization', `Bearer ${token}`)
        .send(projectData);

      const projectId = createResponse.body.id;

      const deleteResponse = await request(app)
        .delete(`/v1/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteResponse.status).toBe(httpStatus.NO_CONTENT);
    });
  });

  describe('PATCH /project/:id', () => {
    it('should update a project', async () => {
      // Create a project first
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        design_url: 'https://example.com/design',
        flow_diagram: 'https://example.com/diagram',
        logo: 'https://example.com/logo'
      };

      const createResponse = await request(app)
        .post('/v1/project/new')
        .set('Authorization', `Bearer ${token}`)
        .send(projectData);

      const projectId = createResponse.body.id;

      const updatedProjectData = {
        name: 'Updated Test Project',
        description: 'Updated Test Description'
      };

      const updateResponse = await request(app)
        .patch(`/v1/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProjectData);

      expect(updateResponse.status).toBe(httpStatus.OK);
      expect(updateResponse.body.name).toBe('Updated Test Project');
      expect(updateResponse.body.description).toBe('Updated Test Description');
      // Add more expectations based on your project schema
    });
  });
});
