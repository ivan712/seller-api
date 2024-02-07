import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshTokenInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      phoneNumber: request.user.phoneNumber,
      token: request.user.refreshToken,
    };
  },
);
