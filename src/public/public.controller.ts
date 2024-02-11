import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { ImageService } from './image.service';

@Controller('public')
export class PublicController {
  constructor(private imageService: ImageService) {}

  @Get('images/:image')
  getImage(@Param('image') path: string, @Res() res: Response): void {
    return res.sendFile(this.imageService.getImage(path));
  }
}
