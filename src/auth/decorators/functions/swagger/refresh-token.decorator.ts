import { applyDecorators } from '@nestjs/common';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function RefreshTokenSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('Refresh Token'),
    ApiCookieAuth(),
    ApiBearerAuth(),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            description: 'JWT Token',
          },
          expiresToken: {
            type: 'integer',
            format: 'int64', // Use 'int64' for Unix timestamp
            description:
              'Unix timestamp representing the expiration time of the token',
          },
        },
        example: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2M2M0MzFjLTQ4N2YtNDVhNS04NzIwLWRkYmEwMjg1MGJiYiIsInVzZXJuYW1lIjoicmVyZSIsImF1dGhfb3JpZ2luIjoicmVmcmVzaF90b2tlbiIsImlhdCI6MTcwMDExMjU4OSwiZXhwIjoxNzAwMTEyODg5fQ.lSsNUQiKfplU3yfBA0WG5KcZDv6q8ozqebpUq6_gKSU',
          expiresToken: 1700112889754,
        },
      },
    }),
    ApiUnauthorizedResponse({
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          statusCode: { type: 'number' },
        },
        example: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
  );
}
