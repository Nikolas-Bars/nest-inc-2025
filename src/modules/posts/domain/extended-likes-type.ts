export type ExtendedLikesInfoType = {
  likesCount: number,
  dislikesCount: number,
  myStatus: LikeStatusEnum,
  newestLikes: NewestLikesType[]
}

export enum LikeStatusEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike'
}

export type NewestLikesType = {
  addedAt: Date,
  userId: string,
  login: string
}
