import { Body, Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { AdminGuard } from 'src/guards';
import { DeleteUserDto, UpdatePlayerDto } from 'src/dtos';
import { User } from 'src/schemas';

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
  getUsers(): Promise<User[]> {
    return this.adminService.getUsers();
  }
}
