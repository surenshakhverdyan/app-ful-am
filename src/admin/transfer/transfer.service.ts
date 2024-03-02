import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { AcceptTransferDto, SetTransferDto } from 'src/dtos';
import { Status, TransferStatus } from 'src/enums';
import { Config, Player, Team, Transfer } from 'src/schemas';

@Injectable()
export class TransferService {
  constructor(
    @InjectModel(Config.name) private configModel: Model<Config>,
    @InjectModel(Transfer.name) private transferModel: Model<Transfer>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @InjectConnection() private connection: Connection,
  ) {}

  async setTransfer(dto: SetTransferDto): Promise<boolean> {
    try {
      const config = await this.configModel.findOne({
        endTransfers: { $ne: null },
      });

      if (!config) {
        await this.configModel.create({ endTransfers: dto.endTransfers });
      } else {
        config.endTransfers = dto.endTransfers;
        await config.save();
      }

      return true;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }

  async transfer(dto: AcceptTransferDto): Promise<boolean> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      const transfer = await this.transferModel.findById(dto.transferId);

      if (dto.status === true) {
        const from = await this.teamModel
          .findByIdAndUpdate(
            transfer.fromTeam,
            { $pull: { players: transfer.player } },
            { new: true },
          )
          .session(session);
        if (from.players.length < 9) {
          from.status = Status.Inactive;
          await from.save({ session });
        }

        const to = await this.teamModel
          .findByIdAndUpdate(
            transfer.toTeam,
            { $push: { players: transfer.player } },
            { new: true },
          )
          .session(session);
        if (to.players.length > 8) {
          to.status = Status.Active;
          await to.save({ session });
        }

        await this.playerModel
          .findByIdAndUpdate(
            transfer.player,
            { $set: { team: transfer.toTeam } },
            { new: true },
          )
          .session(session);

        transfer.status = TransferStatus.Transferred;
        await transfer.save({ session });
      } else {
        transfer.status = TransferStatus.Declined;
        await transfer.save({ session });
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
