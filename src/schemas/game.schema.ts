import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Ligue } from './ligue.schema';
import { Team } from './team.schema';

@Schema({ timestamps: true })
export class Game {
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
            player: { type: Types.ObjectId, ref: 'Player' },
            count: { type: Number },
          },
        ],
        assists: [
          {
            from: { type: Types.ObjectId, ref: 'Player' },
            to: { type: Types.ObjectId, ref: 'Player' },
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
  team1: { team: Team; goals: []; assists: []; cards: [] }[];

  @Prop({
    type: [
      {
        team: { type: Types.ObjectId, ref: 'Team' },
        goals: [
          {
            player: { type: Types.ObjectId, ref: 'Player' },
            count: { type: Number },
          },
        ],
        assists: [
          {
            from: { type: Types.ObjectId, ref: 'Player' },
            to: { type: Types.ObjectId, ref: 'Player' },
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
  team2: { team: Team; goals: []; assists: []; cards: [] }[];

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
