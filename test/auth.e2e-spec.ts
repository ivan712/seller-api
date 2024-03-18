import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { OK_MESSAGE } from '../src/messages.constant';

describe('RoomController (e2e)', () => {
  let app: INestApplication;

  const phoneNumber = '+79856829334';
  const INVALID_PHONE_NUMBER = 'phoneNumber must be a valid phone number';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  describe('/preregister (POST)', () => {
    it('success', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/preregister')
        .send({ phoneNumber })
        .expect(HttpStatus.OK)
        .then(({ body }: request.Response) => {
          expect(body.message).toBe(OK_MESSAGE);
        });
    });

    it('invalid phone number', () => {
      const phoneNumber = '123';
      return request(app.getHttpServer())
        .post('/v1/auth/preregister')
        .send({ phoneNumber })
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }: request.Response) => {
          expect(body.message[0]).toBe(INVALID_PHONE_NUMBER);
        });
    });
  });
});
