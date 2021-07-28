import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaMongoose } from 'mongoose';
import { Player } from 'src/players/schemas/player.schema';

export interface Event {
  name: string;
  operation: string;
  value: number;
}

export type CategoryDocument = Category & Document;

@Schema({ collection: 'categories', timestamps: true })
export class Category {
  @Prop({ unique: true })
  category: string;

  @Prop()
  description: string;

  @Prop()
  event: Array<Event>;

  @Prop([{ type: SchemaMongoose.Types.ObjectId, ref: Player.name }])
  players: Array<Player>;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
