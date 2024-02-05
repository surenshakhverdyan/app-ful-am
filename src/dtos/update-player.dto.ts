import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Position } from 'src/enums';

export class UpdatePlayerDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  playerId: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(Position)
  @IsOptional()
  position?: Position;

  @IsOptional()
  number?: number;
}
