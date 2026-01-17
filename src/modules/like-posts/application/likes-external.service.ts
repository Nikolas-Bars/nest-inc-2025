import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesExternalService {
  // constructor(private readonly ) {}
  async updatePostLikeStatus(postId: string): Promise<boolean> {
    return false
  }
}
