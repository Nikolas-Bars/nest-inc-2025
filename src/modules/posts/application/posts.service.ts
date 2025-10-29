import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CreatePostDto, UpdatePostDto } from '../dto/create-update-post.dto';
import {
  CreatePostInputDto,
  UpdatePostInputDto,
} from '../api/input-dto/posts.input-dto';
import { BlogsExternalService } from '../../blogs/application/blogs-external.service';
import { BlogExternalViewDto } from '../../blogs/api/view-dto/blogs-external-dto';

@Injectable()
export class PostsService {
  constructor(
    //инжектирование модели в сервис через DI
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsExternalService: BlogsExternalService,
  ) {}

  async createPost(dto: CreatePostInputDto): Promise<string> {
    let blog: BlogExternalViewDto | null;

    try {
      blog = await this.blogsExternalService.getBlogById(dto.blogId);
    } catch (error) {
      // Если невалидный ObjectId, Mongoose выбросит CastError
      throw new BadRequestException('Blog not found');
    }
    // Эта проверка тоже нужна, на случай если blog не найден, но id валидный
    if (!blog) {
      throw new BadRequestException('Blog not found');
    }

    const postBody: CreatePostDto = {
      ...dto,
      blogName: blog.name
    }

    const post = this.PostModel.createInstance(postBody);

    await this.postsRepository.save(post);

    return post._id.toString();
  }
  async updatePost(id: string, dto: UpdatePostInputDto) {
    let blog: BlogExternalViewDto | null;
    try {
      blog = await this.blogsExternalService.getBlogById(dto.blogId);
    } catch (error) {
      // Если невалидный ObjectId, Mongoose выбросит CastError
      throw new BadRequestException('Blog not found');
    }
    // Эта проверка тоже нужна, на случай если blog не найден, но id валидный
    if (!blog) {
      throw new BadRequestException('Blog not found');
    }

    const post = await this.postsRepository.findOrNotFoundFail(id);

    post.update(dto)

    await this.postsRepository.save(post);
  }
  async deletePost(id: string) {
    const postDocument = await this.postsRepository.findOrNotFoundFail(id)

    postDocument.makeDeleted()

    await this.postsRepository.save(postDocument);
  }
}
