import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class JoinRequestDto {
  @IsString()
  @IsNotEmpty()
  requestId: Types.ObjectId;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
