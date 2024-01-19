import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UpdatePasswordDto, UpdateProfileDto } from 'src/dtos';
import { IPayload } from 'src/interfaces';
import { User } from 'src/schemas';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async updatePassword(
    token: string,
    dto: UpdatePasswordDto,
  ): Promise<boolean> {
    const payload: IPayload = await this.jwtService.verifyAsync(
      token.split(' ')[1],
      {
        secret: this.configService.get<string>('JWT_AUTH_SECRET'),
      },
    );

    const user = await this.userModel.findById(payload.sub);
    if (!(dto.newPassword === dto.passwordConfirmation))
      throw new HttpException('Passwords do not match', 403);

    if (!(await bcrypt.compare(dto.password, user.password)))
      throw new HttpException('Current password was wrong', 403);

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    user.password = hashedPassword;
    user.save();

    return true;
  }

  async updateProfile(token: string, dto: UpdateProfileDto): Promise<boolean> {
    const { sub } = await this.jwtService.verifyAsync(token.split(' ')[1], {
      secret: this.configService.get<string>('JWT_AUTH_SECRET'),
    });

    await this.userModel.findByIdAndUpdate(sub, { $set: dto }, { new: true });

    return true;
  }
}
