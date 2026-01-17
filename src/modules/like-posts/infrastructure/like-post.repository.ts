import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LikePost, LikePostDocument } from '../domain/like-post.entity';
import type { LikePostModelType } from '../domain/like-post.entity';
import { CreateLikePostDomainDto } from '../domain/dto/like-post.domain.dto';

@Injectable()
export class LikePostRepository {
  //инжектирование модели через DI
  constructor(
    @InjectModel(LikePost.name) private LikePostModel: LikePostModelType,
  ) {}

  create(dto: CreateLikePostDomainDto): LikePostDocument {
    return this.LikePostModel.createInstance(dto);
  }

  async findById(id: string): Promise<LikePostDocument | null> {
    return this.LikePostModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(likePost: LikePostDocument) {
    await likePost.save();
  }

  async findOrNotFoundFail(id: string): Promise<LikePostDocument> {
    const likePost = await this.findById(id);

    if (!likePost) {
      //TODO: replace with domain exception
      throw new NotFoundException('like status not found');
    }

    return likePost;
  }
}
