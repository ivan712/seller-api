import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TokenInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return {
      userId: request.user.userId,
      userContact: request.user.userContact,
      tokenId: request.user.jti,
    };
  },
);
