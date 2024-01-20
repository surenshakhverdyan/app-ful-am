import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Position } from 'src/enums';
import { User } from './user.schema';
import { IPlayer } from 'src/interfaces';

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true })
  user: User;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar: string;

  @Prop({
    type: [
      {
        name: { type: String },
        number: { type: Number },
        position: { type: String, enum: Object.values(Position) },
        avatar: { type: String },
        goals: {
          penalty: { type: Number },
          goal: { type: Number },
        },
        cards: {
          yellow: { type: Number },
          red: { type: Number },
        },
        assist: { type: Number },
      },
    ],
    validate: [
      {
        validator: function (value: any[]) {
          return value.length <= 21;
        },
        message: 'The length of players array must not exceed 21',
      },
      {
        validator: function (value: any[]) {
          const numbers = new Set();
          for (const player of value) {
            if (numbers.has(player.number)) {
              return false;
            }
            numbers.add(player.number);
          }
          return true;
        },
        message: 'Each player must have a unique number',
      },
    ],
  })
  players: Array<IPlayer>;

  @Prop({ required: true, default: false })
  status: boolean;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
