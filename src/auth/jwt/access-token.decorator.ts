import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccessTokenDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return {
      phoneNumber: request.user.phoneNumber,
      accessToken: request.user.accessToken,
    };
  },
);
