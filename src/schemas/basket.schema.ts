import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Basket {
  @Prop({
    type: Types.ObjectId,
    ref: 'League',
    required: true,
  })
  league: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Team' }],
  })
  teams: Types.ObjectId[];
}

export const BasketSchema = SchemaFactory.createForClass(Basket);
