import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Ligue } from './ligue.schema';
import { Team } from './team.schema';

@Schema({ timestamps: true })
export class Game {
  @Prop({ type: Date })
  dataTime: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'Ligue',
  })
  ligue: Ligue;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  win: Team;

  @Prop({
    type: [
      {
        team: { type: Types.ObjectId, ref: 'Team' },
        goals: [
          {
            assist: { type: Types.ObjectId, ref: 'Player' },
            goal: { type: Types.ObjectId, ref: 'Player' },
          },
        ],
        cards: [
          {
            player: { type: Types.ObjectId, ref: 'Player' },
            yellow: { type: Number },
            red: { type: Number },
          },
        ],
      },
    ],
  })
  team1: { team: Team; goals: []; cards: [] }[];

  @Prop({
    type: [
      {
        team: { type: Types.ObjectId, ref: 'Team' },
        goals: [
          {
            assist: { type: Types.ObjectId, ref: 'Player' },
            goal: { type: Types.ObjectId, ref: 'Player' },
          },
        ],
        cards: [
          {
            player: { type: Types.ObjectId, ref: 'Player' },
            yellow: { type: Number },
            red: { type: Number },
          },
        ],
      },
    ],
  })
  team2: { team: Team; goals: []; cards: [] }[];

  @Prop({
    type: String,
  })
  video: string;

  @Prop({
    type: [{ type: String }],
  })
  images: string[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
