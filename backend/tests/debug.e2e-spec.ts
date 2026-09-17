
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Debug App', () => {
  let app: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Print registered routes
    const router = app.getHttpAdapter().getInstance();
    console.log('=== Registered Routes ===');
    router._router.stack.forEach((layer: any) => {
      if (layer.route) {
        console.log(`${Object.keys(layer.route.methods).join(',').toUpperCase()} ${layer.route.path}`);
      } else if (layer.name === 'router') {
        layer.handle.stack.forEach((subLayer: any) => {
          if (subLayer.route) {
            console.log(`${Object.keys(subLayer.route.methods).join(',').toUpperCase()} ${subLayer.route.path}`);
          }
        });
      }
    });
    console.log('===========================');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should have routes', async () => {
    // just pass
  });
});