import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EdituserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  name: string;
}
