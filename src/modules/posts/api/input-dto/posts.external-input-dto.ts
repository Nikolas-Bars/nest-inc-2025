//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreatePostExternalInputDto {
  title: string;
  shortDescription: string;
  content: string;
}

export class CreatePostExternalServiceDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
}

export class UpdateExternalPostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}
