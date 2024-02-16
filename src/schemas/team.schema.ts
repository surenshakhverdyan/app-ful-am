import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { User } from './user.schema';
import { Status } from 'src/enums';

@Schema({ timestamps: true })
export class Team {
  equals(team: string) {
    throw new Error('Method not implemented.');
  }
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
    unique: true,
  })
  user: User;

  @Prop({
    required: true,
    type: String,
    unique: true,
    uppercase: true,
  })
  name: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Player' }],
    validate: [
      {
        validator: (value: any[]) => {
          return value.length <= 21;
        },
        message: 'The length of players array must not exceed 21',
      },
    ],
  })
  players: Types.ObjectId[];

  @Prop({
    required: true,
    type: String,
    enum: Object.values(Status),
    default: Status.Inactive,
  })
  status: Status;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
