import {
  Body,
  Controller,
  Headers,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/guards';
import { UserService } from './user.service';
import { UpdatePasswordDto, UpdateProfileDto } from 'src/dtos';
import { IUserResponse } from 'src/interfaces';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('update-password')
  updatePassword(
    @Headers('authorization') token: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<boolean> {
    return this.userService.updatePassword(token, dto);
  }

  @Put('update-profile')
  updateProfile(
    @Headers('authorization') token: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<IUserResponse> {
    return this.userService.updateProfile(token, dto);
  }
}
