import { ObjectId } from 'mongoose';

import { Role } from 'src/enums';

export interface IUserResponse {
  name: string;
  email: string;
  phone: string;
  password: string;
  roles: [Role];
  team?: ObjectId;
}
