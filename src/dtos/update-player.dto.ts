import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlayerDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  playerId: string;
}
