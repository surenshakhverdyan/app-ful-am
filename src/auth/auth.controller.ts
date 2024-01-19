import {
  Body,
  Controller,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto, SignInDto } from 'src/dtos';
import { IUserResponse } from 'src/interfaces';
import { Request } from 'express';
import { RefreshGuard } from 'src/guards';
import { ResetPasswordGuard } from 'src/guards/reset-password.guard';

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

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<boolean> {
    return this.authService.forgotPassword(dto);
  }

  @UseGuards(ResetPasswordGuard)
  @Patch('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() dto: ResetPasswordDto,
  ): Promise<boolean> {
    return this.authService.resetPassword(token, dto);
  }
}