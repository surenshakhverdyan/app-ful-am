import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { AdminService } from './admin.service';
import {
  DeletedPlayer,
  DeletedPlayerSchema,
  DeletedTeam,
  DeletedTeamSchema,
  Team,
  TeamSchema,
  User,
  UserSchema,
} from 'src/schemas';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Team.name,
        schema: TeamSchema,
      },
      {
        name: DeletedPlayer.name,
        schema: DeletedPlayerSchema,
      },
      {
        name: DeletedTeam.name,
        schema: DeletedTeamSchema,
      },
    ]),
  ],
  providers: [AdminService, JwtService],
  controllers: [AdminController],
})
export class AdminModule {}
