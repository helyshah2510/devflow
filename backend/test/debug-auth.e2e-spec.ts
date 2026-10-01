import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';

describe('Debug Auth & Projects Flow (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Trace Login and Projects flow', async () => {
    // 1. Try to register a test user
    const testEmail = `test_${Date.now()}@example.com`;
    const regRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: 'password123' });
    
    console.log('REGISTER response status:', regRes.status, regRes.body);

    // 2. Login to get token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: 'password123' });

    console.log('LOGIN response status:', loginRes.status, loginRes.body);
    const token = loginRes.body.accessToken;

    // 3. GET /projects with token
    const getProjectsRes = await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${token}`);

    console.log('GET /projects status:', getProjectsRes.status, getProjectsRes.body);

    // 4. POST /projects with token
    const postProjectRes = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Complete DevFlow',
        description: 'Learn NestJS authorization',
        assignedToId: regRes.body.id,
      });

    console.log('POST /projects status:', postProjectRes.status, postProjectRes.body);
  });
});
