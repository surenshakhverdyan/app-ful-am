import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlayerAvatarDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  playerId: string;
}
