export class CreateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export class UpdateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}

//              DTO4/ws/presentation
// fronttender - DTO3/presentation - DTO2/application - DTO1/repository
// fronttender - DTO1/presentation - DTO1/application - DTO1/repository
