import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { User } from 'src/schemas';
import { ForgotPasswordDto, ResetPasswordDto, SignInDto } from 'src/dtos';
import { IPayload, IUserResponse } from 'src/interfaces';
import { forgotPasswordTemplate } from 'src/templates';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signIn(dto: SignInDto): Promise<{
    userResponse: IUserResponse;
    authToken: string;
    refreshToken: string;
  }> {
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
      expiresIn: '30d', // change to 1d
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { userResponse, authToken, refreshToken };
  }

  async refreshToken(
    req: Request,
  ): Promise<{ userResponse: IUserResponse; authToken: string }> {
    const payload: IPayload = await this.jwtService.verifyAsync(
      req['refresh'],
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );
    delete payload.exp;
    delete payload.iat;

    const user = await this.userModel.findById(payload.sub);
    const userResponse: IUserResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roles: user.roles,
      team: user.team,
    };

    const authToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_AUTH_SECRET'),
      expiresIn: '1d',
    });

    return { userResponse, authToken };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<boolean> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new HttpException('User not found', 404);

    const payload: IPayload = { sub: user._id, roles: user.roles };
    const resetPasswordToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_FORGOT_PASSWORD_SECRET'),
      expiresIn: '1h',
    });
    const link = `${this.configService.get<string>('BASE_URL')}/reset-password/${resetPasswordToken}`;

    const email = await this.mailerService.sendMail({
      from: this.configService.get<string>('EMAIL_ADDRESS'),
      to: user.email,
      subject: 'Reset password',
      html: forgotPasswordTemplate(link),
    });

    if (!(email.response.split(' ')[0] === '250')) return false;

    return true;
  }

  async resetPassword(token: string, dto: ResetPasswordDto): Promise<boolean> {
    if (!(dto.password === dto.passwordConfirmation))
      throw new HttpException('Passwords do not match', 403);

    const { sub } = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_FORGOT_PASSWORD_SECRET'),
    });
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.userModel.findByIdAndUpdate(
      sub,
      { $set: { password: hashedPassword } },
      { new: true },
    );

    return true;
  }
}
