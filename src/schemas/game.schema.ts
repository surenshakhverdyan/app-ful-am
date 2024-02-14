import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Ligue } from './ligue.schema';
import { Team } from './team.schema';
import { GameStatus } from 'src/enums';
import { Player } from './player.schema';

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
  winner: Team;

  @Prop({
    type: [
      {
        team: { type: Types.ObjectId, ref: 'Team' },
        players: [{ type: Types.ObjectId, ref: 'Player' }],
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
  team1: { team: Team; players: Player[]; goals: []; cards: [] }[];

  @Prop({
    type: [
      {
        team: { type: Types.ObjectId, ref: 'Team' },
        players: [{ type: Types.ObjectId, ref: 'Player' }],
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
  team2: { team: Team; players: Player[]; goals: []; cards: [] }[];

  @Prop({
    type: String,
  })
  video: string;

  @Prop({
    type: [{ type: String }],
  })
  images: string[];

  @Prop({
    type: String,
    enum: Object.values(GameStatus),
    default: GameStatus.Pending,
  })
  status: GameStatus;
}

export const GameSchema = SchemaFactory.createForClass(Game);
