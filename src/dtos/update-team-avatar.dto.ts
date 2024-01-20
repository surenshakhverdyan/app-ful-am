import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTeamAvatarDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;
}
