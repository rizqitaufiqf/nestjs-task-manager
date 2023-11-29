import { applyDecorators } from '@nestjs/common';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function RefreshTokenSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('Refresh Token'),
    ApiCookieAuth(),
    ApiOkResponse({
      schema: {
        example: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2M2M0MzFjLTQ4N2YtNDVhNS04NzIwLWRkYmEwMjg1MGJiYiIsInVzZXJuYW1lIjoicmVyZSIsImF1dGhfb3JpZ2luIjoicmVmcmVzaF90b2tlbiIsImlhdCI6MTcwMDExMjU4OSwiZXhwIjoxNzAwMTEyODg5fQ.lSsNUQiKfplU3yfBA0WG5KcZDv6q8ozqebpUq6_gKSU',
          tokenExpires: 1700112889754,
        },
      },
    }),
    ApiUnauthorizedResponse({
      schema: {
        example: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
  );
}
