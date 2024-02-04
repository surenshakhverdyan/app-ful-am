import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class DeletedTeam {
  @Prop()
  user: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  avatar: string;

  @Prop()
  _id: Types.ObjectId;
}

export const DeletedTeamSchema = SchemaFactory.createForClass(DeletedTeam);
