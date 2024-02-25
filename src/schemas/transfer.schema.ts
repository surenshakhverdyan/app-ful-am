import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { TransferStatus } from 'src/enums';

@Schema({ timestamps: true })
export class Transfer {
  @Prop({
    type: Types.ObjectId,
    ref: 'Player',
  })
  player: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  team: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(TransferStatus),
    default: TransferStatus.Pending,
  })
  status: string;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
