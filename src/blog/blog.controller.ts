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
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './blog.entity';
import { GetBlogQueryDto } from './dto/get-blog-query.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getAllPosts(@Query() queryDto: GetBlogQueryDto) {
    return this.blogService.getAllPosts(queryDto);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<Blog> {
    return this.blogService.getPostById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPost(@Body() createBlogDto: CreateBlogDto): Promise<Blog> {
    return this.blogService.createPost(createBlogDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogService.updatePost(id, updateBlogDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.blogService.deletePost(id);
  }
}