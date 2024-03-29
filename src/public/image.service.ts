import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class ImageService {
  getImage(path: string): string {
    const imagePath = join(__dirname, '../..', 'uploads', path);
    return imagePath;
  }
}
