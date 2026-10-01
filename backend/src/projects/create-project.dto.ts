import { IsInt,IsNotEmpty,IsOptional,IsString,IsArray } from "class-validator";

export class CreateProjectDto{
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsOptional()
    @IsString()
    description?:string;

   @IsArray()
   @IsInt({ each: true })
   memberIds: number[];
}