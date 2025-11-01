import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { Post } from '../../domain/post.entity';
import type { PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../api/view-dto/posts.view-dto';
import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { PostsViewExternalDto } from '../../api/view-dto/posts.view-external-dto';
@Injectable()
export class PostsQueryExternalRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async getPostsByBlogId(blogId: string, query: GetPostsQueryParams): Promise<PaginatedViewDto<PostsViewExternalDto[]>> {
    const filter = {
      deletedAt: null,
      blogId: blogId,
    }
    const posts = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.PostModel.countDocuments(filter);

    const items = posts.map(PostsViewExternalDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
  async findPostByIdOrFailExternal(id: string): Promise<PostsViewExternalDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostsViewExternalDto.mapToView(post);
  }
}
