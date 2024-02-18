import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { Position } from 'src/enums';

export class AddPlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Position)
  @IsNotEmpty()
  position: string;

  @IsNotEmpty()
  number: number;

  @IsString()
  @IsOptional()
  team?: Types.ObjectId;

  @IsString()
  @IsOptional()
  avatar?: string;
}
