import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { CreatePostInputDto, UpdatePostInputDto } from './input-dto/posts.input-dto';
import { PostViewDto } from './view-dto/posts.view-dto';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { UpdatePostDto } from '../dto/create-update-post.dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';
import { GetCommentsQueryParams } from '../../comments/api/input-dto/get-comments-query-params.input-dto';
import { CommentViewDto } from '../../comments/api/view-dto/comment.view-dto';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {
    console.log('PostsController created');
  }
  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAll(query);
  }
  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostViewDto> {
    return await this.postsQueryRepository.findPostByIdOrFail(id)
  }
  @Get(':id/comments')
  async getCommentsByPostId(
    @Param('id') id: string,
    @Query() query: GetCommentsQueryParams,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {

    await this.postsQueryRepository.findPostByIdOrFail(id);

    return this.commentsQueryRepository.getCommentsByPostId(id, query)

  }
  @Post()
  async create(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const newPostId = await this.postsService.createPost(body);

    return this.postsQueryRepository.findPostByIdOrFail(newPostId);
  }
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Body() body: UpdatePostInputDto, @Param('id') id: string) {
     return await this.postsService.updatePost(id, body);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id)
  }
}
