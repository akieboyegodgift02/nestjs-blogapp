import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async getAllPosts(): Promise<Blog[]> {
    return this.blogRepository.find();
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