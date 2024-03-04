import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { JoinRequestStatus } from 'src/enums';

@Schema({ timestamps: true })
export class JoinRequest {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({
    type: String,
    enum: Object.values(JoinRequestStatus),
    default: JoinRequestStatus.Active,
  })
  status: string;
}

export const JoinRequestSchema = SchemaFactory.createForClass(JoinRequest);
