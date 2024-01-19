import { Types } from 'mongoose';

import { Role } from 'src/enums';

export interface IUserResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password?: string;
  roles: [Role];
  team?: Types.ObjectId;
}
