import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Ligue } from './ligue.schema';
import { Team } from './team.schema';

@Schema({ timestamps: true })
export class Basket {
  @Prop({
    type: Types.ObjectId,
    ref: 'Ligue',
    required: true,
  })
  ligue: Ligue;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Team' }],
  })
  teams: Team[];
}

export const BasketSchema = SchemaFactory.createForClass(Basket);
