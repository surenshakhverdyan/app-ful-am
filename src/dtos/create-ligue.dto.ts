import { IsArray, IsNotEmpty, IsString } from 'class-validator';

class Team {
  @IsString()
  team: string;
}

export class CreateLigueDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  teams: Team[];
}
