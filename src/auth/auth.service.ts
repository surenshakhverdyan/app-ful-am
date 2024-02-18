import { MailerService } from '@nestjs-modules/mailer';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { ResetPasswordDto, SignInDto, ForgotPasswordDto } from 'src/dtos';
import { TokenType } from 'src/enums';
import { IUser } from 'src/interfaces';
import { User } from 'src/schemas';
import { TokenService } from 'src/services';
import { forgotPasswordTemplate } from 'src/templates';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
    private mailerService: MailerService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async signIn(
    dto: SignInDto,
  ): Promise<{ userResponse: IUser; authToken: string; refreshToken: string }> {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .populate('team');

    if (!user) throw new HttpException('User not found', 404);

    if (!(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      team: user.team,
    };

    const payload = {
      sub: userResponse._id,
      role: userResponse.role,
      type: TokenType.AuthToken,
    };

    const authToken = this.tokenService.jwtSign(payload);
    payload.type = TokenType.RefreshToken;
    const refreshToken = this.tokenService.jwtRefreshSign(payload);

    return {
      userResponse: userResponse,
      authToken,
      refreshToken,
    };
  }

  async refreshToken(
    req: Request,
  ): Promise<{ userResponse: IUser; authToken: string }> {
    const token = req.headers.refresh as string;
    const payload = this.jwtService.decode(token);

    const user = await this.userModel.findById(payload.sub);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      team: user.team,
    };

    payload.type = TokenType.AuthToken;
    delete payload.exp;
    delete payload.iat;

    const authToken = this.tokenService.jwtSign(payload);

    return {
      userResponse,
      authToken,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<boolean> {
    const user = await this.userModel.findOne({ email: dto.email });

    if (!user) throw new HttpException('User not found', 404);

    const payload = {
      sub: user._id.toString(),
      role: user.role,
      type: TokenType.ForgotPasswordToken,
    };

    const token = this.tokenService.jwtForgotPasswordSign(payload);
    const link = `${this.configService.get<string>('BASE_URL')}/reset-password/${token}`;
    const template = forgotPasswordTemplate(link);

    const res = await this.mailerService.sendMail({
      from: this.configService.get<string>('EMAIL_ADDRESS'),
      to: user.email,
      subject: 'Reset Password',
      html: template,
    });

    if (!(res.response.split(' ')[0] === '250')) return false;

    return true;
  }

  async resetPassword(token: string, dto: ResetPasswordDto): Promise<boolean> {
    if (dto.password !== dto.passwordConfirmation)
      throw new HttpException('Passwords do not match', 403);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const payload = this.tokenService.jwtVerify(token);

    await this.userModel.findByIdAndUpdate(
      payload.sub,
      { $set: { password: hashedPassword } },
      { new: true },
    );

    return true;
  }
}
