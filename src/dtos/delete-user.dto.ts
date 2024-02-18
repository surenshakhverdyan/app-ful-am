import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class DeleteUserDto {
  @IsString()
  @IsNotEmpty()
  userId: Types.ObjectId;
}
