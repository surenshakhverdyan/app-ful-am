import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Position } from 'src/enums';

export class AddPlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Position)
  @IsNotEmpty()
  position: Position;

  @IsNotEmpty()
  number: number;

  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
