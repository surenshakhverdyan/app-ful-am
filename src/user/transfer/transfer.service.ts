import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Model, Types } from 'mongoose';

import { Config, Player, Team, Transfer } from 'src/schemas';
import { TransferDto } from 'src/dtos';
import { TokenService } from 'src/services';

@Injectable()
export class TransferService {
  constructor(
    @InjectModel(Transfer.name) private transferModel: Model<Transfer>,
    @InjectModel(Config.name) private configModel: Model<Config>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @Inject(REQUEST) private request: Request,
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  async createTransfer(dto: TransferDto): Promise<Transfer> {
    const date = Date.now();
    const endTransfers = await this.configModel
      .findOne()
      .select('endTransfers');

    if (date > endTransfers.endTransfers)
      throw new HttpException('Transfers are closed', 403);

    const token = this.tokenService.extractJwtFromHeaders(this.request);
    const { sub } = this.jwtService.decode(token);
    const player = await this.playerModel.findById(dto.playerId);
    const team = await this.teamModel.findOne({
      user: new Types.ObjectId(sub),
    });

    try {
      const transfer = await this.transferModel.create({
        player: new Types.ObjectId(dto.playerId),
        fromTeam: player.team,
        toTeam: team._id,
      });

      const transferred = (
        await transfer.populate({
          path: 'team',
          model: 'Team',
          select: 'name',
        })
      ).populate('player');

      return transferred;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
