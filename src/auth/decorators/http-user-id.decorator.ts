import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const HttpUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return 'user' in req && 'sub' in req.user ? req.user.sub : null;
  },
);
