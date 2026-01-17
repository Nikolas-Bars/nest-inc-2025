import { LikePostStatusEnum } from '../like-post-type';

export class LikePostDomainDto {
  userId: string;
  postId: string;
  status: LikePostStatusEnum;
}

export class UpdateLikePostDomainDto {
  userId?: string;
  postId?: string;
  status: LikePostStatusEnum;
}
