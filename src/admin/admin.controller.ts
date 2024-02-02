import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  UseGuards,
  Patch,
  Headers,
  Put,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { AdminGuard } from 'src/guards';
import {
  DeleteUserDto,
  UpdatePasswordDto,
  UpdatePlayerDto,
  UpdateProfileDto,
} from 'src/dtos';
import { IUserResponse } from 'src/interfaces';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('create-user')
  createUser(@Body() dto: CreateUserDto): Promise<boolean> {
    return this.adminService.createUser(dto);
  }

  @Delete('delete-player')
  deletePlayer(@Body() dto: UpdatePlayerDto): Promise<boolean> {
    return this.adminService.deletePlayer(dto);
  }

  @Delete('delete-user')
  DeleteUser(@Body() dto: DeleteUserDto): Promise<boolean> {
    return this.adminService.deleteUser(dto);
  }

  @Get('get-users')
  getUsers(): Promise<IUserResponse[]> {
    return this.adminService.getUsers();
  }

  @Patch('update-password')
  updatePassword(
    @Headers('authorization') token: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<boolean> {
    return this.adminService.passwordUpdate(token, dto);
  }

  @Put('update-profile')
  updateProfile(
    @Headers('authorization') token: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<boolean> {
    return this.adminService.updateProfile(token, dto);
  }

  @Get('get-roles')
  getRoles(): Record<string, string> {
    return this.adminService.getRoles();
  }
}
