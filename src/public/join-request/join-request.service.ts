import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateJoinRequestDto } from 'src/dtos';
import { JoinRequest } from 'src/schemas';

@Injectable()
export class JoinRequestService {
  constructor(
    @InjectModel(JoinRequest.name) private joinRequestModel: Model<JoinRequest>,
  ) {}

  async createJoinRequest(dto: CreateJoinRequestDto): Promise<boolean> {
    try {
      await this.joinRequestModel.create(dto);

      return true;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
