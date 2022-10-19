import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('E2E', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  describe('App Module', () => {
    it('GET /', () => {
      return request(app.getHttpServer()).get('/').expect(200);
    });
  });

  describe('Blocks Module', () => {
    it('GET /blocks/tip', () => {
      return request(app.getHttpServer()).get('/blocks/tip').expect(200);
    });
  });

  describe('NFT Module', () => {
    it('GET /nfts/:id bitcoin monkey', () => {
      return request(app.getHttpServer())
        .get(
          '/nfts/SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys:3',
        )
        .expect(200);
    });

    it('GET /nfts/:id bitcoin monkey with invalid ID', () => {
      return request(app.getHttpServer())
        .get(
          '/nfts/SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys:99999',
        )
        .expect(404);
    });

    it('GET /nfts/:id random ', () => {
      return request(app.getHttpServer()).get('/nfts/random').expect(400);
    });
  });
});
