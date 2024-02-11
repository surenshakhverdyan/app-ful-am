import { Role } from 'src/enums';
import { Team } from 'src/schemas';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  team?: Team;
}
