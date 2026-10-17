import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetBlogQueryDto } from './dto/get-blog-query.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async getAllPosts(queryDto: GetBlogQueryDto) {
    const { page = 1, limit = 5, search } = queryDto;
    const skip = (page - 1) * limit;

    const query = this.blogRepository.createQueryBuilder('blog');
    
    // If a search term is provided, filter by title or content
    if (search) {
      query.andWhere(
        '(blog.title LIKE :search OR blog.content LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting (newest first) and pagination
    query
      .orderBy('blog.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPostById(id: string): Promise<Blog> {
    const post = await this.blogRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return post;
  }

  async createPost(createBlogDto: CreateBlogDto): Promise<Blog> {
    const newPost = this.blogRepository.create(createBlogDto);
    return this.blogRepository.save(newPost);
  }

  async updatePost(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const post = await this.getPostById(id); // Ensures post exists
    
    // Merge updates and save
    this.blogRepository.merge(post, updateBlogDto);
    return this.blogRepository.save(post);
  }

  async deletePost(id: string): Promise<void> {
    const result = await this.blogRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
  }
}