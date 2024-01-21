import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

import { CreateUserDto, DeleteUserDto } from 'src/dtos';
import { Team, User } from 'src/schemas';
import { IUserResponse } from 'src/interfaces';
import { welcomeTemplate } from 'src/templates';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.userModel.create({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        roles: [dto.role],
      });

      const userResponse: IUserResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: dto.password,
        roles: user.roles,
      };

      const email = await this.mailerService.sendMail({
        from: this.configService.get<string>('EMAIL_ADDRESS'),
        to: userResponse.email,
        subject: 'FUL.AM',
        html: welcomeTemplate(userResponse),
      });

      if (!(email.response.split(' ')[0] === '250')) return false;
    } catch (error: any) {
      if (error.code === 11000)
        throw new HttpException('The email or phone already taken', 403);
    }

    return true;
  }

  async deleteUser(dto: DeleteUserDto): Promise<boolean> {
    try {
      const user = await this.userModel
        .findByIdAndDelete(dto.userId)
        .populate('team');
      if (user.team.avatar !== undefined)
        fs.promises.unlink(`uploads/${user.team.avatar}`);

      user.team.players.forEach((player) => {
        if (player.avatar !== undefined)
          fs.promises.unlink(`uploads/${player.avatar}`);
      });

      await this.teamModel.findByIdAndDelete(user.team);
    } catch (error: any) {
      throw new HttpException(error.message, error.code);
    }

    return true;
  }
}
