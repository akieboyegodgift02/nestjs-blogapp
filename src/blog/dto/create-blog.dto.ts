import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    content: string;

    @IsString()
    @IsNotEmpty()
    author: string;
}