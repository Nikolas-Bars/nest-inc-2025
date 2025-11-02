export class CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string
}

export class UpdatePostDto {
  title?: string;
  shortDescription?: string;
  content?: string;
  blogId: string;
  blogName?: string;
}

//              DTO4/ws/presentation
// fronttender - DTO3/presentation - DTO2/application - DTO1/repository
// fronttender - DTO1/presentation - DTO1/application - DTO1/repository
