import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IPlayer extends Player, Document {
  _id: string;
}

// export type PlayerDocument = Player & Document;

@Schema({ collection: 'players', timestamps: true })
export class Player {
  // @Prop()
  // _id: string;

  @Prop({ unique: true })
  phoneNumber: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  ranking: string;

  @Prop()
  positionRanking: number;

  @Prop()
  urlAvatar: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
