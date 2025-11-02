import { CommentDocument } from '../../domain/comment.entity';
import { LikeStatusCommentEnum } from '../../domain/likes-info-type';

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusCommentEnum;
  };
  createdAt: Date;

  static mapToView(comment: CommentDocument): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = comment._id.toString();
    dto.content = comment.content
    dto.commentatorInfo = { ...comment.commentatorInfo }
    dto.createdAt = comment.createdAt
    dto.likesInfo = { ...comment.likesInfo }

    return dto;
  }
}
