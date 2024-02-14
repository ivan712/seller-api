import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TokenInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      phoneNumber: request.user.phoneNumber,
      tokenId: request.user.jti,
    };
  },
);
