import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesExternalService {
  async updatePostLikeStatus(postId: string): Promise<boolean> {
    return false
  }
}
