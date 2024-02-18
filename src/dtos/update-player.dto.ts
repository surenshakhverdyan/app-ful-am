import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { Position } from 'src/enums';

export class UpdatePlayerDto {
  @IsString()
  @IsNotEmpty()
  playerId: Types.ObjectId;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(Position)
  @IsOptional()
  position?: string;

  @IsOptional()
  number?: number;

  @IsString()
  @IsOptional()
  avatar?: string;
}
