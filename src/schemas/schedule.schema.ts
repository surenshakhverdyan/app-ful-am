import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Game } from './game.schema';
import { Team } from './team.schema';
import { Player } from './player.schema';

@Schema({ timestamps: true })
export class Schedule {
  @Prop({
    type: Types.ObjectId,
    ref: 'Game',
  })
  game: Game;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  team: Team;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Player' }],
  })
  players: Player[];

  @Prop({ type: Date })
  date: Date;
}
