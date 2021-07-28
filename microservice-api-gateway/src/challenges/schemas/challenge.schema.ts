import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaMongoose } from 'mongoose';
import { Player, IPlayer } from 'src/players/schemas/player.schema';
import { Game } from './game.schema';

export type ChallengeDocument = Challenge & Document;

@Schema({ collection: 'challenges', timestamps: true })
export class Challenge {
  @Prop()
  dateTimeChallenge: Date;

  @Prop()
  status: string;

  @Prop()
  dateTimeRequest: Date;

  @Prop()
  dateTimeResponse: Date;

  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: Player.name })
  requester: number;

  @Prop()
  category: string;

  @Prop([
    {
      type: SchemaMongoose.Types.ObjectId,
      ref: Player.name,
    },
  ])
  players: Array<IPlayer>;

  @Prop({
    type: SchemaMongoose.Types.ObjectId,
    ref: Game.name,
  })
  games: Game;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
