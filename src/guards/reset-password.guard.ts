import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenType } from 'src/enums';
import { TokenService } from 'src/services';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token as string;

    if (!token) throw new UnauthorizedException();

    const payload = this.tokenService.jwtVerify(token);

    if (payload.type === TokenType.ForgotPasswordToken) return true;

    throw new UnauthorizedException();
  }
}
