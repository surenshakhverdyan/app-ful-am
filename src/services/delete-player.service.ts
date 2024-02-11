import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { DeletePlayerDto } from 'src/dtos';
import { Status } from 'src/enums';
import { Player, Team } from 'src/schemas';

@Injectable()
export class DeletePlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
  ) {}

  async DeletePlayer(dto: DeletePlayerDto): Promise<boolean> {
    const playerId = new Types.ObjectId(dto.playerId);

    try {
      await this.playerModel.findByIdAndUpdate(
        playerId,
        {
          $set: { status: Status.Deleted },
        },
        { new: true },
      );

      const team = await this.teamModel.findOneAndUpdate(
        { players: playerId },
        { $pull: { players: playerId } },
        { new: true },
      );

      if (team.players.length < 9) {
        team.status = Status.Inactive;
        await team.save();
      }

      return true;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
