import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
    try {
      const transfer = await this.transferModel.findById(dto.transferId);

      if (dto.status === true) {
        const from = await this.teamModel.findByIdAndUpdate(
          transfer.fromTeam,
          { $pull: { players: transfer.player } },
          { new: true },
        );
        if (from.players.length < 9) {
          from.status = Status.Inactive;
          await from.save();
        }

        const to = await this.teamModel.findByIdAndUpdate(
          transfer.toTeam,
          { $push: { players: transfer.player } },
          { new: true },
        );
        if (to.players.length > 8) {
          to.status = Status.Active;
          await to.save();
        }

        await this.playerModel.findByIdAndUpdate(
          transfer.player,
          { $set: { team: transfer.toTeam } },
          { new: true },
        );

        transfer.status = TransferStatus.Transferred;
        await transfer.save();
      } else {
        transfer.status = TransferStatus.Declined;
        await transfer.save();
      }

      return true;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
