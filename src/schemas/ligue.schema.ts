import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Team } from './team.schema';
import { Game } from './game.schema';
import { LigueStatus } from 'src/enums';

@Schema({ timestamps: true })
export class Ligue {
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
  place1: Team;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  place2: Team;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  place3: Team;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Game' }],
  })
  games: Game[];

  @Prop({
    type: [
      {
        team: { type: Types.ObjectId, ref: 'Team' },
        points: { type: Number },
      },
    ],
  })
  teams: { team: Team; points: number }[];

  @Prop({
    type: String,
    enum: Object.values(LigueStatus),
    default: LigueStatus.Active,
  })
  status: LigueStatus;
}

export const LigueSchema = SchemaFactory.createForClass(Ligue);
