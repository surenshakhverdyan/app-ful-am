import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenType } from 'src/enums';
import { TokenService } from 'src/services';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.refresh;

    if (!token) throw new UnauthorizedException();

    const payload = this.tokenService.jwtVerify(token);

    if (payload.type === TokenType.RefreshToken) return true;

    throw new UnauthorizedException();
  }
}
