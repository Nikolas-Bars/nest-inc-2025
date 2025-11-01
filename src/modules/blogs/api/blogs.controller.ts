import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { BlogViewDto } from './view-dto/blogs.view-dto';
import { ApiParam } from '@nestjs/swagger';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogInputDto } from './input-dto/blogs.input-dto';
import { PostsViewExternalDto } from '../../posts/api/view-dto/posts.view-external-dto';
import {
  PostsQueryExternalRepository
} from '../../posts/infrastructure/external-query/posts.query-external-repository';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import {
  CreatePostExternalInputDto,
  CreatePostExternalServiceDto,
} from '../../posts/api/input-dto/posts.external-input-dto';
import { PostsExternalService } from '../../posts/application/posts.external-service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsExternalQueryRepository: PostsQueryExternalRepository,
    private blogsService: BlogsService,
    private postsExternalService: PostsExternalService,
    //private blogsService: UsersService,
  ) {
    console.log('BlogsController created');
  }
  @ApiParam({ name: 'blogId' })
  @Get(':id')
  async getBlogById(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getBlogByIdOrFail(id);
  }
  @Get()
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAll(query);
  }

  @Get(':id/posts')
  @ApiParam({ name: 'blogId' })
  async getPostsByBlogId(@Param('id') id: string, @Query() query: GetPostsQueryParams): Promise<PaginatedViewDto<PostsViewExternalDto[]>> {

    await this.blogsQueryRepository.getBlogByIdOrFail(id)

    return await this.postsExternalQueryRepository.getPostsByBlogId(id, query)
  }

  @Post()
  async create(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const newBlogId = await this.blogsService.createBlog(body);

    return this.blogsQueryRepository.getBlogByIdOrFail(newBlogId);
  }

  @Post(':id/posts/')
  @ApiParam({ name: 'blogId' })
  async createPostForBlog(@Body() body: CreatePostExternalInputDto, @Param('id') id: string): Promise<PostsViewExternalDto> {
    const blog = await this.blogsQueryRepository.getBlogByIdOrFail(id);

    const postCreateData: CreatePostExternalServiceDto = {
      ...body,
      blogId: id,
      blogName: blog.name,
    };

    return await this.postsExternalService.createPostForBlog(
      id,
      postCreateData,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: string, @Body() body: CreateBlogInputDto) {
    return await this.blogsService.update(id, body);
  }

  @ApiParam({ name: 'id' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.blogsService.deleteBlog(id);
  }
}
