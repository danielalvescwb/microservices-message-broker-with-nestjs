import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { Event } from '../schemas/category.schema';
export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  readonly description: string;

  @IsArray()
  @ArrayMinSize(1)
  event: Array<Event>;
}
