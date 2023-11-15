import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GetAuthorization = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    try {
      return request.headers['authorization'].split(' ')[1];
    } catch (e) {
      throw new UnauthorizedException('Invalid access token');
    }
  },
);
