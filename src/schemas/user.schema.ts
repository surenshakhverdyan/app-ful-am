import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Team } from './team.schema';
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
    required: true,
    type: String,
    enum: Object.values(Role),
    default: Role.User,
  })
  role: Role;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  team: Team;
}

export const UserSchema = SchemaFactory.createForClass(User);
