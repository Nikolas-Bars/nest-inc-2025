import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { BlogViewDto } from './view-dto/blogs.view-dto';
import { ApiParam } from '@nestjs/swagger';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogsService } from '../application/blogs.service';


@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService,
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

  @Post()
  async create(@Body() body: CreateBlogDto): Promise<BlogViewDto> {
    const newBlogId = await this.blogsService.createBlog(body);

    return this.blogsQueryRepository.getBlogByIdOrFail(newBlogId);
  }

}
