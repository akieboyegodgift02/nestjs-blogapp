import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from './blog.model';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  private posts: Blog[] = [];

  getAllPosts(): Blog[] {
    return this.posts;
  }

  getPostById(id: string): Blog {
    const found = this.posts.find((post) => post.id === id);
    if (!found) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return found;
  }

  createPost(createPostDto: CreateBlogDto): Blog {
    const { title, content, author } = createPostDto;

    const post: Blog = {
      id: Date.now().toString(), // Simple unique ID for now
      title,
      content,
      author,
      createdAt: new Date(),
    };

    this.posts.push(post);
    return post;
  }

  updatePost(id: string, updatePostDto: UpdateBlogDto): Blog {
    const post = this.getPostById(id);

    if (updatePostDto.title !== undefined) {
      post.title = updatePostDto.title;
    }
    if (updatePostDto.content !== undefined) {
      post.content = updatePostDto.content;
    }
    if (updatePostDto.author !== undefined) {
      post.author = updatePostDto.author;
    }

    return post;
  }

  deletePost(id: string): void {
    const found = this.getPostById(id);
    this.posts = this.posts.filter((post) => post.id !== found.id);
  }
}