import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { NotFoundException } from '@nestjs/common';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogService],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPosts', () => {
    it('should return an empty array by default', () => {
      expect(service.getAllPosts()).toEqual([]);
    });
  });

  describe('createPost', () => {
    it('should successfully create and return a blog post', () => {
      const dto = {
        title: 'NestJS Testing',
        content: 'Learning how to write unit tests with Jest.',
        author: 'Jane Doe',
      };

      const post = service.createPost(dto);

      expect(post).toHaveProperty('id');
      expect(post.title).toEqual(dto.title);
      expect(post.content).toEqual(dto.content);
      expect(post.author).toEqual(dto.author);
      expect(service.getAllPosts().length).toEqual(1);
    });
  });

  describe('getPostById', () => {
    it('should return a blog post if a valid ID is provided', () => {
      const dto = {
        title: 'Find Me',
        content: 'Testing getPostById functionality.',
        author: 'John Doe',
      };

      const created = service.createPost(dto);
      const found = service.getPostById(created.id);

      expect(found).toEqual(created);
    });

    it('should throw a NotFoundException if the post does not exist', () => {
      expect(() => service.getPostById('non-existent-id')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('deletePost', () => {
    it('should successfully remove a blog post by ID', () => {
      const dto = {
        title: 'Delete Me',
        content: 'Testing deletion.',
        author: 'John Doe',
      };

      // 1. Create the post first so it actually exists in the array
      const created = service.createPost(dto);

      // 2. Delete using the dynamically generated ID
      service.deletePost(created.id);

      // 3. Verify the posts array is empty again
      expect(service.getAllPosts()).toEqual([]);
    });

    it('should throw a NotFoundException if trying to delete a non-existent post', () => {
      expect(() => service.deletePost('non-existent-id')).toThrow(
        NotFoundException,
      );
    });
  });
});