import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { TokenType } from 'src/enums';
import { IPayload } from 'src/interfaces';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  extractJwtFromHeaders(req: Request): string | undefined {
    const [key, token] = req.headers.authorization?.split(' ') ?? [];
    return key === 'Bearer' ? token : undefined;
  }

  jwtSign(payload: IPayload): string {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_AUTH_SECRET'),
      expiresIn: '30d', // to be change 1d
    });
    return token;
  }

  jwtRefreshSign(payload: IPayload): string {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    return refreshToken;
  }

  jwtForgotPasswordSign(payload: IPayload): string {
    const forgotPasswordToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_FORGOT_PASSWORD_SECRET'),
      expiresIn: '1h',
    });
    return forgotPasswordToken;
  }

  jwtVerify(token: string): IPayload {
    try {
      const { type } = this.jwtService.decode(token);
      let secret: string;
      switch (type) {
        case TokenType.AuthToken:
          secret = this.configService.get<string>('JWT_AUTH_SECRET');
          break;
        case TokenType.RefreshToken:
          secret = this.configService.get<string>('JWT_REFRESH_SECRET');
          break;
        case TokenType.ForgotPasswordToken:
          secret = this.configService.get<string>('JWT_FORGOT_PASSWORD_SECRET');
          break;
      }
      const payload = this.jwtService.verify(token, {
        secret: secret,
      });
      return payload;
    } catch (error: any) {
      throw new HttpException(error.message, error.code);
    }
  }
}
