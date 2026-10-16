import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

describe('BlogController', () => {
  let controller: BlogController;

  const mockBlogService = {
    getAllPosts: jest.fn().mockResolvedValue([]),
    getPostById: jest.fn().mockResolvedValue({ id: '1', title: 'Test' }),
    createPost: jest.fn().mockImplementation((dto) => Promise.resolve({ id: '1', ...dto })),
    updatePost: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
    deletePost: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: mockBlogService,
        },
      ],
    }).compile();

    controller = module.get<BlogController>(BlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getAllPosts on service', async () => {
    expect(await controller.getAllPosts()).toEqual([]);
    expect(mockBlogService.getAllPosts).toHaveBeenCalled();
  });
});