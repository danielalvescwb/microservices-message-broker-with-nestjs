import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaMongoose } from 'mongoose';
import { Player } from 'src/players/schemas/player.schema';
import { Result } from '../interfaces/result.interface';

export type GameDocument = Game & Document;

@Schema({ collection: 'games', timestamps: true })
export class Game {
  @Prop()
  category: string;

  @Prop([
    {
      type: SchemaMongoose.Types.ObjectId,
      ref: Player.name,
    },
  ])
  players: Array<Player>;

  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: Player.name })
  winner: Player;

  @Prop()
  result: Result[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
