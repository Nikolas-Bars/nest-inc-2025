import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { LikePostStatusEnum } from '../domain/like-post-type';

export class CreateLikePostDto {
  @IsString({ message: 'code must be a string' })
  @IsUUID('1', { message: 'code must be a valid UUID v1' })
  userId: string;
  @IsString({ message: 'code must be a string' })
  @IsUUID('1', { message: 'code must be a valid UUID v1' })
  postId: string;
  @IsEnum(LikePostStatusEnum)
  status: LikePostStatusEnum;
}

export class UpdateLikePostDto {
  @IsOptional()
  @IsString({ message: 'code must be a string' })
  @IsUUID('1', { message: 'code must be a valid UUID v1' })
  userId?: string;
  @IsOptional()
  @IsString({ message: 'code must be a string' })
  @IsUUID('1', { message: 'code must be a valid UUID v1' })
  postId?: string;
  @IsEnum(LikePostStatusEnum)
  status: LikePostStatusEnum;
}
