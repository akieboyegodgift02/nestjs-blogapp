import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { NotFoundException } from '@nestjs/common';

describe('BlogService', () => {
  let service: BlogService;

  // Create a mock repository object representing TypeORM's Repository
  const mockBlogRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((blog) => Promise.resolve({ id: '1', ...blog, createdAt: new Date() })),
    delete: jest.fn(),
    merge: jest.fn().mockImplementation((entity, dto) => Object.assign(entity, dto)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(Blog),
          useValue: mockBlogRepository,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPosts', () => {
    it('should return an array of posts', async () => {
      const mockPosts = [{ id: '1', title: 'Test Blog', content: 'Hello', author: 'Alice', createdAt: new Date() }];
      mockBlogRepository.find.mockResolvedValue(mockPosts);

      const result = await service.getAllPosts();
      expect(result).toEqual(mockPosts);
      expect(mockBlogRepository.find).toHaveBeenCalled();
    });
  });

  describe('getPostById', () => {
    it('should return a post by id', async () => {
      const mockPost = { id: '1', title: 'Test Blog', content: 'Hello', author: 'Alice', createdAt: new Date() };
      mockBlogRepository.findOneBy.mockResolvedValue(mockPost);

      const result = await service.getPostById('1');
      expect(result).toEqual(mockPost);
      expect(mockBlogRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException if post is not found', async () => {
      mockBlogRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getPostById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPost', () => {
    it('should successfully create and return a post', async () => {
      const dto = { title: 'New Post', content: 'Content', author: 'Bob' };

      const result = await service.createPost(dto);
      expect(result).toHaveProperty('id');
      expect(result.title).toEqual(dto.title);
      expect(mockBlogRepository.save).toHaveBeenCalled();
    });
  });

  describe('deletePost', () => {
    it('should delete a post if it exists', async () => {
      const mockPost = { id: '1', title: 'Test', content: 'Content', author: 'Bob', createdAt: new Date() };
      mockBlogRepository.findOneBy.mockResolvedValue(mockPost);
      mockBlogRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.deletePost('1')).resolves.not.toThrow();
      expect(mockBlogRepository.delete).toHaveBeenCalledWith('1');
    });

  it('should throw NotFoundException if post to delete does not exist', async () => {
        mockBlogRepository.delete.mockResolvedValue({ affected: 0 }); // Tell mock to simulate 0 rows deleted

        await expect(service.deletePost('999')).rejects.toThrow(
          NotFoundException,
        );
      });
    });
});