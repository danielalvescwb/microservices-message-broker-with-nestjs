import { IsNotEmpty } from 'class-validator';
import { Result } from '../interfaces/result.interface';
import { IPlayer } from '../../players/schemas/player.schema';

export class SetChallengeGameDTO {
  @IsNotEmpty()
  winner: string;

  @IsNotEmpty()
  result: Array<Result>;
}
