import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';

import { DeletePlayerDto } from 'src/dtos';
import { Status } from 'src/enums';
import { Player, Team } from 'src/schemas';

@Injectable()
export class DeletePlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectConnection() private connection: Connection,
  ) {}

  async DeletePlayer(dto: DeletePlayerDto): Promise<boolean> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      await this.playerModel
        .findByIdAndUpdate(
          dto.playerId,
          {
            $set: { status: Status.Deleted },
          },
          { new: true },
        )
        .session(session);

      const team = await this.teamModel
        .findOneAndUpdate(
          { players: new Types.ObjectId(dto.playerId) },
          { $pull: { players: new Types.ObjectId(dto.playerId) } },
          { new: true },
        )
        .session(session);

      if (team.players.length < 9) {
        team.status = Status.Inactive;
        await team.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return true;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      throw new HttpException(error.message, 500);
    }
  }
}
