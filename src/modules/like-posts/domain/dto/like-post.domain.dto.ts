import { LikePostStatusEnum } from '../like-post-type';

export class CreateLikePostDomainDto {
  userId: string;
  postId: string;
  status: LikePostStatusEnum;
}

export class UpdateCreateLikePostDomainDto {
  status: LikePostStatusEnum;
}
