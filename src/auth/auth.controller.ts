import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from 'src/dtos';
import { IUserResponse } from 'src/interfaces';
import { Request } from 'express';
import { RefreshGuard } from 'src/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() dto: SignInDto): Promise<{
    userResponse: IUserResponse;
    authToken: string;
    refreshToken: string;
  }> {
    return this.authService.signIn(dto);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh-token')
  refreshToken(@Headers() req: Request): Promise<{ authToken: string }> {
    return this.authService.refreshToken(req);
  }
}
