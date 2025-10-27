import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import type { BlogModelType } from '../../domain/blog.entity';
import { Blog } from '../../domain/blog.entity';
import { GetBlogsQueryParams } from '../../api/input-dto/get-blogs-query-params.input-dto';
import { BlogViewDto } from '../../api/view-dto/blogs.view-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogsModel: BlogModelType,
  ) {}

  // async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
  //   const user = await this.BlogsModel.findOne({
  //     _id: id,
  //     deletedAt: null,
  //   });
  //
  //   if (!user) {
  //     throw new NotFoundException('blog not found');
  //   }
  //
  //   return BlogViewDto.mapToView(user);
  // }
  async getBlogByIdOrFail(id: string): Promise<BlogViewDto> {
    const blog = await this.BlogsModel.findOne({_id: id, deletedAt: null})

    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return BlogViewDto.mapToView(blog)
  }
  async getAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const filter: FilterQuery<Blog> = {
      deletedAt: null,
    };

    if (query.searchNameTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: query.searchNameTerm, $options: 'i' },
      });
    }

    const blogs = await this.BlogsModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.BlogsModel.countDocuments(filter);

    const items = blogs.map(BlogViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
