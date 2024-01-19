import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from 'src/schemas';
import { SignInDto } from 'src/dtos';
import { IPayload, IUserResponse } from 'src/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new HttpException('User not found', 404);

    if (!(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException();

    const userResponse: IUserResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roles: user.roles,
      team: user.team,
    };

    const payload: IPayload = { sub: user._id, roles: user.roles };

    const authToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_AUTH_SECRET'),
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { userResponse, authToken, refreshToken };
  }
}
