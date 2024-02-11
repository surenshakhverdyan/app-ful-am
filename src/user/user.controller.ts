import { Body, Controller, Patch, Put } from '@nestjs/common';

import { UpdatePasswordDto, UpdateProfileDto } from 'src/dtos';
import { IUser } from 'src/interfaces';
import { UpdateUserService } from 'src/services';

@Controller('user')
export class UserController {
  constructor(private updateUserService: UpdateUserService) {}

  @Put('update-profile')
  updateUser(@Body() dto: UpdateProfileDto): Promise<IUser> {
    return this.updateUserService.userUpdate(dto);
  }

  @Patch('update-password')
  updatePassword(@Body() dto: UpdatePasswordDto): Promise<boolean> {
    return this.updateUserService.updatePassword(dto);
  }
}
