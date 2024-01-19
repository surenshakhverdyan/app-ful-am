import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Role } from 'src/enums';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: Role.User })
  roles: [Role];

  @Prop({ required: false })
  team?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
