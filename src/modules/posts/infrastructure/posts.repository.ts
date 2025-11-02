import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../domain/post.entity';
import type { PostDocument, PostModelType } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  //инжектирование модели через DI
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(post: PostDocument) {
    await post.save();
  }

  async findOrNotFoundFail(id: string): Promise<PostDocument> {
    const post = await this.findById(id);

    if (!post) {
      //TODO: replace with domain exception
      throw new NotFoundException('post not found');
    }

    return post;
  }
}
