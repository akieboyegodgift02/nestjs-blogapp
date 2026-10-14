import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Blog Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Crucial: apply the same validation pipe used in main.ts so DTO rules are enforced
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/blog (GET) should return an empty array initially', () => {
    return request(app.getHttpServer())
      .get('/blog')
      .expect(200)
      .expect([]);
  });

  it('/blog (POST) should create a new blog post', () => {
    return request(app.getHttpServer())
      .post('/blog')
      .send({
        title: 'E2E Testing Blog',
        content: 'Testing the full HTTP pipeline with Supertest.',
        author: 'Alice Smith',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toEqual('E2E Testing Blog');
      });
  });

  it('/blog/:id (GET) should retrieve a post by its ID', async () => {
    // 1. Create a post first
    const createResponse = await request(app.getHttpServer())
      .post('/blog')
      .send({
        title: 'Findable Post',
        content: 'Content for finding.',
        author: 'Bob',
      });

    const postId = createResponse.body.id;

    // 2. Fetch it using GET /blog/:id
    return request(app.getHttpServer())
      .get(`/blog/${postId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(postId);
        expect(res.body.title).toEqual('Findable Post');
      });
  });
});