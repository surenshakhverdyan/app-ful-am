import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Position } from 'src/enums';

@Schema({ timestamps: true })
export class DeletedPlayer {
  @Prop()
  name: string;

  @Prop()
  number: string;

  @Prop({ type: String, enum: Object.values(Position) })
  position: Position;

  @Prop()
  avatar: string;

  @Prop({ type: { penalty: { type: Number }, goal: { type: Number } } })
  goals: {
    penalty: number;
    goal: number;
  };

  @Prop({ type: { yellow: { type: Number }, red: { type: Number } } })
  cards: {
    yellow: number;
    red: number;
  };

  @Prop()
  assist: number;

  @Prop()
  teamId: Types.ObjectId;

  @Prop()
  _id: Types.ObjectId;
}

export const DeletedPlayerSchema = SchemaFactory.createForClass(DeletedPlayer);
