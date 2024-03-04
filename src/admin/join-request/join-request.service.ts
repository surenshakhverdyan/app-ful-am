import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JoinRequest } from 'src/schemas';

@Injectable()
export class JoinRequestService {
  constructor(
    @InjectModel(JoinRequest.name) private joinRequestModel: Model<JoinRequest>,
  ) {}

  async getJoinRequests(): Promise<JoinRequest[]> {
    const joinRequests = await this.joinRequestModel.find();

    return joinRequests;
  }
}
