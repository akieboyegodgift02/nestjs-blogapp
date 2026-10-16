import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getAllPosts(): Promise<Blog[]> {
    return this.blogService.getAllPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<Blog> {
    return this.blogService.getPostById(id);
  }

  @Post()
  async createPost(@Body() createBlogDto: CreateBlogDto): Promise<Blog> {
    return this.blogService.createPost(createBlogDto);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogService.updatePost(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.blogService.deletePost(id);
  }
}