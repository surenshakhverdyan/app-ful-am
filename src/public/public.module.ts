import { Module } from '@nestjs/common';

import { PublicController } from './public.controller';
import { ImageService } from './image.service';

@Module({
  controllers: [PublicController],
  providers: [ImageService],
})
export class PublicModule {}
