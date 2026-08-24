import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Allows both authenticated users and guests through.
 * If a valid Bearer token is present, req.user is populated.
 * If no token or invalid token, req.user is null — request proceeds as guest.
 *
 * Use on endpoints where auth is optional (e.g., comparison, quick-quote).
 */
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Override to suppress errors — guests are allowed through with req.user = null
  handleRequest(_err: any, user: any) {
    return user ?? null;
  }
}
