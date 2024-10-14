import { IsString } from "class-validator";


class UpdatePostDto {
  @IsString()
  "id": number;

  "content": string;

  "title": string;
}

export default UpdatePostDto;
