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
import type { CreateBlogDto } from './dto/create-blog.dto';
import type { UpdateBlogDto } from './dto/update-blog.dto';
import type { Blog } from './blog.model';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  getAllPosts(): Blog[] {
    return this.blogService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string): Blog {
    return this.blogService.getPostById(id);
  }

  @Post()
  createPost(@Body() createBlogDto: CreateBlogDto): Blog {
    return this.blogService.createPost(createBlogDto);
  }

  @Patch(':id')
  updatePost(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Blog {
    return this.blogService.updatePost(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id') id: string): void {
    this.blogService.deletePost(id);
  }
}