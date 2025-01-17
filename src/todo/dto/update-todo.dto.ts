import { IsOptional, IsBoolean, IsString, MaxLength } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Title is too long. Maximum length is 100 characters.' })
  title?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
