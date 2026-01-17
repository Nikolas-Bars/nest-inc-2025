export type LikePostType = {
  likesCount: number,
  dislikesCount: number,
  myStatus: LikePostStatusEnum,
  // newestLikes: NewestLikesType[]
}

export enum LikePostStatusEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike'
}

// export type NewestLikesType = {
//   addedAt: Date,
//   userId: string,
//   login: string
// }
