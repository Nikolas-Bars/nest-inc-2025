export type CommentLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusCommentEnum;
};

export enum LikeStatusCommentEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike'
}
