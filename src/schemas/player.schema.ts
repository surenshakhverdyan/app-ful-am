import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Position, Status } from 'src/enums';

@Schema({ timestamps: true })
export class Player {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({
    required: true,
    type: Number,
    validate: {
      validator: async function (number: number) {
        const existingPlayer = await (
          this.constructor as Model<Player>
        ).findOne({
          team: this.team,
          number: number,
        });
        return !existingPlayer;
      },
      message: 'Player number must be unique in the team',
    },
  })
  number: number;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(Position),
  })
  position: string;

  @Prop({ type: Number })
  penalties: number;

  @Prop({ type: Number })
  goals: number;

  @Prop({ type: Number })
  yellowCards: number;

  @Prop({ type: Number })
  redCards: number;

  @Prop({ type: Number })
  assists: number;

  @Prop({
    type: String,
    enum: Object.values(Status),
    default: Status.Active,
  })
  status: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Team',
  })
  team: Types.ObjectId;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
