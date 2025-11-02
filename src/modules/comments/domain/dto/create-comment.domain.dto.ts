import { CommentatorInfoType } from '../commentator-info-type';
import { CommentLikesInfoType } from '../likes-info-type';

export class CreateCommentDomainDto {
  content: string;
  commentatorInfo: CommentatorInfoType;
  likesInfo: CommentLikesInfoType;
}
