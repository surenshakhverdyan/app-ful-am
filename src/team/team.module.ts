import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Team, TeamSchema, User, UserSchema } from 'src/schemas';

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
    ]),
  ],
  providers: [TeamService, JwtService],
  controllers: [TeamController],
})
export class TeamModule {}
