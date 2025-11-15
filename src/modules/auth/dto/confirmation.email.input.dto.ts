import { IsString, IsUUID } from 'class-validator';

export class ConfirmationEmailInputDto {
  @IsString({ message: 'code must be a string' })
  @IsUUID('1', { message: 'code must be a valid UUID v1' })
  code: string;
}
