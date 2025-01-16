import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty({
    message: 'Title is required'
  })
  @MaxLength(100, {
    message: 'Title is too long. Maximum lenght is 100 characteres.' 
  })
  title: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
