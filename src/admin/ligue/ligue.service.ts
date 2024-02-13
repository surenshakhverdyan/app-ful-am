import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateLigueDto } from 'src/dtos';
import { Ligue } from 'src/schemas';

@Injectable()
export class LigueService {
  constructor(@InjectModel(Ligue.name) private ligueModel: Model<Ligue>) {}

  async createLigue(dto: CreateLigueDto): Promise<Ligue> {
    try {
      const ligue = await this.ligueModel.create(dto);

      return ligue;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
