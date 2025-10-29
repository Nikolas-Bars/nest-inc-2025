import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { CreatePostInputDto } from './input-dto/posts.input-dto';
import { PostViewDto } from './view-dto/posts.view-dto';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
  ) {
    console.log('PostsController created');
  }
  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAll(query);
  }

  @Post()
  async create(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const newPostId = await this.postsService.createPost(body);

    return this.postsQueryRepository.findPostByIdOrFail(newPostId);
  }
}
