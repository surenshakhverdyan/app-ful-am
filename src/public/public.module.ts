import { Module } from '@nestjs/common';

import { PublicController } from './public.controller';
import { ImageService } from './image.service';
import { JoinRequestService } from './join-request/join-request.service';
import { JoinRequestController } from './join-request/join-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JoinRequest, JoinRequestSchema } from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JoinRequest.name, schema: JoinRequestSchema },
    ]),
  ],
  controllers: [PublicController, JoinRequestController],
  providers: [ImageService, JoinRequestService],
})
export class PublicModule {}
