import { Injectable } from '@nestjs/common';
import { LikePostRepository } from '../infrastructure/like-post.repository';
import { CreateLikePostDto } from '../dto/create-like-post.dto';
import { LikePostDocument } from '../domain/like-post.entity';
import { UpdateLikePostDto } from '../dto/update-like-post.dto';
import {
  CreateLikePostDomainDto,
  UpdateCreateLikePostDomainDto,
} from '../domain/dto/like-post.domain.dto';

@Injectable()
export class LikesPostExternalService {
  constructor(private readonly likePostRepository: LikePostRepository) {}
  async updateLikePostStatus(likeId: string, data: UpdateLikePostDto) {
    const like = await this.likePostRepository.findOrNotFoundFail(likeId);

    const dataForUpdate: UpdateCreateLikePostDomainDto = {
      status: data.status
    }

    like.update(dataForUpdate)

    await this.likePostRepository.save(like);
  }

  async createLikePostStatus(likePost: CreateLikePostDto): Promise<LikePostDocument> {
    const newLike: CreateLikePostDomainDto = {...likePost}

    const like = this.likePostRepository.create(newLike);

    await this.likePostRepository.save(like)

    return like;
  }
}
