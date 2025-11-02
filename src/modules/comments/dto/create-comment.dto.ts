
export class CreateCommentDto {
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
}

export class UpdateCommentDto {
  content: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusCommentEnum;
  };
}

enum LikeStatusCommentEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike'
}
