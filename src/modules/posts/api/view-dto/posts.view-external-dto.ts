import { ExtendedLikesInfoType } from '../../domain/extended-likes-type';
import { PostDocument } from '../../domain/post.entity';

export class PostsViewExternalDto {
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: Date
  extendedLikesInfo: ExtendedLikesInfoType
  id: string

  static mapToView(post: PostDocument): PostsViewExternalDto {
    const dto = new PostsViewExternalDto();

    dto.id = post._id.toString();
    dto.blogId = post.blogId
    dto.blogName = post.blogName
    dto.title = post.title
    dto.content = post.content
    dto.extendedLikesInfo = { ...post.extendedLikesInfo }
    dto.extendedLikesInfo.newestLikes = { ...post.extendedLikesInfo.newestLikes }
    dto.createdAt = post.createdAt
    dto.shortDescription = post.shortDescription

    return dto;
  }
}
