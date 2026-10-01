import { IsInt, IsNotEmpty, IsOptional, IsString,IsArray } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  assignedToId?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  memberIds?: number[];
}