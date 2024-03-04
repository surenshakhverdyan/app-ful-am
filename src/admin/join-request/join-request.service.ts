import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JoinRequestDto } from 'src/dtos';

import { JoinRequestStatus } from 'src/enums';
import { JoinRequest } from 'src/schemas';

@Injectable()
export class JoinRequestService {
  constructor(
    @InjectModel(JoinRequest.name) private joinRequestModel: Model<JoinRequest>,
  ) {}

  async getJoinRequests(): Promise<JoinRequest[]> {
    const joinRequests = await this.joinRequestModel.find({
      status: JoinRequestStatus.Active,
    });

    return joinRequests;
  }

  async joinRequest(dto: JoinRequestDto): Promise<boolean> {
    try {
      const status = dto.status
        ? JoinRequestStatus.Accepted
        : JoinRequestStatus.Rejected;

      await this.joinRequestModel.findByIdAndUpdate(
        dto.requestId,
        { $set: { status } },
        { new: true },
      );

      return true;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
