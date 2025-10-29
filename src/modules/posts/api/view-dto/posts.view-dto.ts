import { ExtendedLikesInfoType } from '../../domain/extended-likes-type';
import { PostDocument } from '../../domain/post.entity';

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  createdAt: Date;
  content: string;
  blogId: string;
  blogName: string;
  extendedLikesInfo: ExtendedLikesInfoType;

  static mapToView(post: PostDocument): PostViewDto {
    const dto = new PostViewDto();

    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.id = post._id.toString();
    dto.createdAt = post.createdAt;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.extendedLikesInfo = post.extendedLikesInfo;

    return dto;
  }
}
