import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { AdminService } from './admin.service';
import { User, UserSchema } from 'src/schemas';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [AdminService, JwtService],
  controllers: [AdminController],
})
export class AdminModule {}
