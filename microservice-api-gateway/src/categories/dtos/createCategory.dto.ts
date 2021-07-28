import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IPlayer } from '../../players/schemas/player.schema';
import { Event } from '../schemas/category.schema';
export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsArray()
  @ArrayMinSize(1)
  event: Array<Event>;

  players: Array<IPlayer>;
}
