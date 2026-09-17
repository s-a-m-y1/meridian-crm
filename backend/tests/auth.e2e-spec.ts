import request from 'supertest';
import { User } from '../src/modules/users/user.entity';
import { Organization } from '../src/modules/organizations/entities/organization.entity';
import * as bcrypt from 'bcryptjs';
import { app, testDataSource } from './setup-e2e';

describe('Auth E2E', () => {
  let accessToken: string;
  let refreshToken: string;
  let userId: string;
  let orgId: string;

  beforeEach(async () => {
    await testDataSource.query('TRUNCATE "users", "organizations", "organization_members", "organization_settings", "refresh_tokens" RESTART IDENTITY CASCADE');
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and organization', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'e2e@example.com', name: 'E2E User', password: 'Password123!' })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('familyId');
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;

      const users = await testDataSource.getRepository(User).find();
      const orgs = await testDataSource.getRepository(Organization).find();
      expect(users.length).toBe(1);
      expect(orgs.length).toBe(1);
      userId = users[0].id;
      orgId = orgs[0].id;
      expect(users[0].email).toBe('e2e@example.com');
      expect(orgs[0].name).toBe("E2E User's Organization");
    });

    it('should reject duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'dup@example.com', name: 'Dup', password: 'Password123!' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'dup@example.com', name: 'Dup2', password: 'Password123!' })
        .expect(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      const passwordHash = await bcrypt.hash('Password123!', 4);
      const user = testDataSource.getRepository(User).create({
        email: 'login@example.com',
        name: 'Login User',
        passwordHash,
      });
      await testDataSource.getRepository(User).save(user);
    });

    it('should login and return tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'login@example.com', password: 'Password123!' })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('should reject wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'login@example.com', password: 'WrongPass!' })
        .expect(401);
    });

    it('should reject non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'none@example.com', password: 'Password123!' })
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    beforeEach(async () => {
      const passwordHash = await bcrypt.hash('Password123!', 4);
      const user = testDataSource.getRepository(User).create({
        email: 'refresh@example.com',
        name: 'Refresh User',
        passwordHash,
      });
      await testDataSource.getRepository(User).save(user);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'refresh@example.com', password: 'Password123!' });
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('should rotate tokens (new refresh token issued)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      // Refresh token MUST rotate (new token issued)
      expect(res.body.refreshToken).not.toBe(refreshToken);
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('should reject reused refresh token (reuse detection)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });

    it('should reject invalid token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    beforeEach(async () => {
      const passwordHash = await bcrypt.hash('Password123!', 4);
      const user = testDataSource.getRepository(User).create({
        email: 'me@example.com',
        name: 'Me User',
        passwordHash,
      });
      await testDataSource.getRepository(User).save(user);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'me@example.com', password: 'Password123!' });
      accessToken = res.body.accessToken;
    });

    it('should return current user with valid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('email', 'me@example.com');
      expect(res.body).toHaveProperty('name', 'Me User');
    });

    it('should reject without token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    beforeEach(async () => {
      const passwordHash = await bcrypt.hash('Password123!', 4);
      const user = testDataSource.getRepository(User).create({
        email: 'logout@example.com',
        name: 'Logout User',
        passwordHash,
      });
      await testDataSource.getRepository(User).save(user);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'logout@example.com', password: 'Password123!' });
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('should revoke refresh token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(204);

      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });
  });
});