import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Position } from 'src/enums';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar?: string;

  @Prop({ minlength: 9, maxlength: 21 })
  players: [
    {
      name: string;
      number: number;
      position: Position;
      avatar?: string;
      goals: {
        penalty: number;
        goal: number;
      };
      cards: {
        yellow: number;
        red: number;
      };
      asist: number;
    },
  ];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
