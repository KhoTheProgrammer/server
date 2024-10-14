import { IsString } from "class-validator";

 export class CreatePostDto {
  @IsString()
  content: string;

  @IsString()
  title: string;
}
