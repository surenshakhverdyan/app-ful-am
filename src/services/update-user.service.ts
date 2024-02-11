import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UpdatePasswordDto, UpdateProfileDto } from 'src/dtos';
import { IUser } from 'src/interfaces';
import { User } from 'src/schemas';
import { TokenService } from './jwt.service';
import { Request } from 'express';

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(REQUEST) private request: Request,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async userUpdate(dto: UpdateProfileDto): Promise<IUser> {
    const token = this.tokenService.extractJwtFromHeaders(this.request);
    const { sub } = this.jwtService.decode(token);

    try {
      const user = await this.userModel.findByIdAndUpdate(
        sub,
        { $set: dto },
        { new: true },
      );

      const userResponse = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        team: user.team,
      };

      return userResponse;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }

  async updatePassword(dto: UpdatePasswordDto): Promise<boolean> {
    const token = this.tokenService.extractJwtFromHeaders(this.request);
    const { sub } = this.jwtService.decode(token);

    const user = await this.userModel.findById(sub);

    if (!(await bcrypt.compare(dto.password, user.password)))
      throw new HttpException('The current password was wrong', 403);

    if (dto.newPassword !== dto.passwordConfirmation)
      throw new HttpException('The passwords do not match', 403);

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return true;
  }
}
