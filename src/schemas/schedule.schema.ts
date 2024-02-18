import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Team } from './team.schema';

@Schema({ timestamps: true })
export class Schedule {
  @Prop({
    type: Types.ObjectId,
    ref: 'Game',
  })
  game: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  team: Team;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Player' }],
  })
  players: Types.ObjectId[];

  @Prop({ type: Date })
  date: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
