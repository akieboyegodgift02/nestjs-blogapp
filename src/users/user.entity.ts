import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Blog } from '../blog/blog.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  // Optional relation: a user can write many blog posts
  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];
}