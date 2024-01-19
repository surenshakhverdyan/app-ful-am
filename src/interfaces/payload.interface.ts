import { Types } from 'mongoose';

import { Role } from 'src/enums';

export interface IPayload {
  sub: Types.ObjectId;
  roles: [Role];
  iat?: Date;
  exp?: Date;
}
