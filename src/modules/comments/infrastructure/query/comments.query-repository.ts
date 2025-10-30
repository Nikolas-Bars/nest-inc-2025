import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '../../domain/comment.entity';
import type { CommentModelType } from '../../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { GetCommentsQueryParams } from '../../api/input-dto/get-comments-query-params.input-dto';
import { FilterQuery } from 'mongoose';
import { PostViewDto } from '../../../posts/api/view-dto/posts.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentsModel: CommentModelType
  ) {}

  async getCommentsByPostId(postId: string, query: GetCommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const filter: FilterQuery<Comment> = {
      postId: postId,
      deletedAt: null
    }

    const comments = await this.CommentsModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.CommentsModel.countDocuments(filter);

    const items = comments.map(CommentViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findOrFail(id: string): Promise<CommentViewDto> {
    const comment = await this.CommentsModel.findById(id);

    if (!comment) {
      throw new NotFoundException('Could not find comment');
    }

    return CommentViewDto.mapToView(comment);
  }

}
