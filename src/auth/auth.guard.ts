import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  private readonly CONTEXT_TYPES = {
    HTTP: 'http',
    GRAPHQL: 'graphql',
  };

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super();
  }

  getHttpRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  async canActivate(context): Promise<boolean> {
    let canActivate;

    const allowUnauthorized = this.contextMetadata<boolean>(
      context,
      'AUTH_ALLOW_UNAUTHORIZED',
    );
   if (context.contextType === this.CONTEXT_TYPES.HTTP) {
      const req = this.getHttpRequest(context);
      const user = await this.authService.decodeAccessToken(
        AuthService.extractBearer(req.headers.authorization),
      );
      if (user || allowUnauthorized) {
        req.user = user || {};
        canActivate = true;
      }
    } else {
      canActivate = false;
    }
    return canActivate;
  }
  private contextMetadata<T>(context: ExecutionContext, metadataKey) {
    return this.reflector.getAllAndOverride<T>(metadataKey, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
