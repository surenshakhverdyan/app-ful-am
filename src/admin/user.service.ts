import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, DeleteUserDto } from 'src/dtos';
import { Player, Team, User } from 'src/schemas';
import { welcomeTemplate } from 'src/templates';
import { Role, Status } from 'src/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    private readonly configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.userModel.create({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: dto.role,
      });

      const template = welcomeTemplate(user, dto.password);

      const res = await this.mailerService.sendMail({
        from: this.configService.get<string>('EMAIL_ADDRESS'),
        to: user.email,
        subject: 'Welcome',
        html: template,
      });

      if (!(res.response.split(' ')[0] === '250')) return false;

      return true;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }

  async deleteUser(dto: DeleteUserDto): Promise<boolean> {
    try {
      const user = await this.userModel.findByIdAndDelete(dto.userId);
      const team = await this.teamModel.findOneAndUpdate(
        { user: user._id },
        { $set: { status: Status.Deleted } },
        { new: true },
      );
      if (team && team.players.length > 0) {
        team.players.map(async (player) => {
          await this.playerModel.findByIdAndUpdate(
            player,
            { $set: { status: Status.Deleted } },
            { new: true },
          );
        });
      }

      return true;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userModel
      .find({ role: Role.User })
      .populate({
        path: 'team',
        select: '-createdAt -updatedAt -__v',
        populate: {
          path: 'players',
          model: 'Player',
          select: '-createdAt -updatedAt -team -__v',
        },
      })
      .select('-password -createdAt -updatedAt -__v');

    return users;
  }
}
