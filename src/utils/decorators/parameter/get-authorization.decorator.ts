import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAuthorization = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.headers;
    if (data === 'authorization')
      return request.headers['authorization'].split(' ')[1];
    return request.headers[data];
  },
);
