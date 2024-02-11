import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Position, Status } from 'src/enums';
import { Team } from './team.schema';

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
  position: Position;

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
    required: true,
    type: String,
    enum: Object.values(Status),
    default: Status.Active,
  })
  status: Status;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Team',
  })
  team: Team;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
