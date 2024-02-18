import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Role } from 'src/enums';

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  phone: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(Role),
    default: Role.User,
  })
  role: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  team: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
