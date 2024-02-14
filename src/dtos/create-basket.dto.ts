import { IsArray, IsNotEmpty, IsString } from 'class-validator';

class Team {
  @IsString()
  team: string;
}

export class CreateBasketDto {
  @IsString()
  ligue: string;

  @IsArray()
  @IsNotEmpty()
  teams: Team[];
}
