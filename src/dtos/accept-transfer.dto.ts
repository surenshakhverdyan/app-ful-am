import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class AcceptTransferDto {
  @IsNotEmpty()
  @IsString()
  transferId: Types.ObjectId;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
