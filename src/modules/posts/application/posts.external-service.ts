import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { Injectable, Param } from '@nestjs/common';
import { PostsViewExternalDto } from '../api/view-dto/posts.view-external-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';
import { CreatePostInputDto } from '../api/input-dto/posts.input-dto';
import {
  CreatePostExternalInputDto,
  CreatePostExternalServiceDto,
} from '../api/input-dto/posts.external-input-dto';
import { PostsQueryExternalRepository } from '../infrastructure/external-query/posts.query-external-repository';
@Injectable()
export class PostsExternalService {
  constructor(
    @InjectModel(Post.name)
    private postModel: PostModelType,
    private postsRepository: PostsRepository,
    private postsQueryExternalRepository: PostsQueryExternalRepository
  ) {}

  async createPostForBlog(blogId: string, dto: CreatePostExternalServiceDto): Promise<PostsViewExternalDto> {

    const post = this.postModel.createInstance(dto)

    await this.postsRepository.save(post)

    return await this.postsQueryExternalRepository.findPostByIdOrFailExternal(post._id.toString())
  }
}
