import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { LeagueStatus } from 'src/enums';

@Schema({ timestamps: true })
export class League {
  @Prop({
    required: true,
    type: String,
    uppercase: true,
  })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  place1: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  place2: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  place3: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Game' }],
  })
  games: Types.ObjectId[];

  @Prop({
    type: [
      {
        team: { type: Types.ObjectId, ref: 'Team' },
        points: { type: Number },
      },
    ],
  })
  teams: { team: Types.ObjectId; points: number }[];

  @Prop({
    type: String,
    enum: Object.values(LeagueStatus),
    default: LeagueStatus.Active,
  })
  status: string;
}

export const LeagueSchema = SchemaFactory.createForClass(League);
