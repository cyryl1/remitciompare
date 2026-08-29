import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // If refreshToken is in cookie, put it in the body so the strategy can extract it
    if (request.cookies && request.cookies.refresh_token) {
      if (!request.body) request.body = {};
      request.body.refreshToken = request.cookies.refresh_token;
    }
    return request;
  }
}
