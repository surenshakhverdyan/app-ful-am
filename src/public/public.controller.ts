import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('uploads/:image')
  getImage(@Param('image') path: string, @Res() res: Response): void {
    return res.sendFile(this.publicService.getImage(path));
  }
}
