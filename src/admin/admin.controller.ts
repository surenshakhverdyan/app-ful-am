import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { AdminGuard } from 'src/guards';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('create-user')
  createUser(@Body() dto: CreateUserDto): Promise<boolean> {
    return this.adminService.createUser(dto);
  }
}
