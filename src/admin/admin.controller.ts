import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import {
  CreateUserDto,
  DeletePlayerDto,
  DeleteUserDto,
  UpdatePasswordDto,
  UpdateProfileDto,
} from 'src/dtos';
import { AdminGuard } from 'src/guards';
import { IUser } from 'src/interfaces';
import {
  DeletePlayerService,
  TeamService,
  UpdateUserService,
} from 'src/services';
import { Team, User } from 'src/schemas';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private userService: UserService,
    private updateUserService: UpdateUserService,
    private deletePlayerService: DeletePlayerService,
    private teamService: TeamService,
  ) {}

  @Post('create-user')
  createUser(@Body() dto: CreateUserDto): Promise<boolean> {
    return this.userService.createUser(dto);
  }

  @Delete('delete-user')
  deleteUser(@Body() dto: DeleteUserDto): Promise<boolean> {
    return this.userService.deleteUser(dto);
  }

  @Put('update-profile')
  updateUser(@Body() dto: UpdateProfileDto): Promise<IUser> {
    return this.updateUserService.userUpdate(dto);
  }

  @Patch('update-password')
  updatePassword(@Body() dto: UpdatePasswordDto): Promise<boolean> {
    return this.updateUserService.updatePassword(dto);
  }

  @Get('get-users')
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Delete('delete-player')
  deltePlayer(@Body() dto: DeletePlayerDto): Promise<boolean> {
    return this.deletePlayerService.DeletePlayer(dto);
  }

  @Get('get-teams')
  getTeams(): Promise<Team[]> {
    return this.teamService.getTeams();
  }
}
