import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

let app: INestApplication;
let testDataSource: DataSource;

async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const nestApp = moduleFixture.createNestApplication();
  const config = nestApp.get(ConfigService);

  nestApp.use(helmet());
  nestApp.setGlobalPrefix('api/v1');
  nestApp.enableCors({
    origin: config.get<string>('cors.origin'),
    credentials: true,
  });
  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await nestApp.init();
  return nestApp;
}

beforeAll(async () => {
  app = await createTestApp();
  testDataSource = app.get(DataSource);
  await testDataSource.runMigrations();
}, 60000);

afterAll(async () => {
  if (testDataSource?.isInitialized) await testDataSource.destroy();
  await app.close();
});

beforeEach(async () => {
  if (testDataSource?.isInitialized) {
    await testDataSource.query('TRUNCATE "users", "organizations", "organization_members", "organization_settings", "refresh_tokens" RESTART IDENTITY CASCADE');
  }
});

export { app, testDataSource };