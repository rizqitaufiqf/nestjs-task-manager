import { applyDecorators } from '@nestjs/common';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function MeSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('Get User Data'),
    ApiBearerAuth(),
    ApiOkResponse({
      schema: {
        example: {
          id: 'dc4f688d-6c65-4aa3-a1aa-4ea80c59b199',
          username: 'user_name',
          email: null,
          createdAt: '2023-11-15T22:12:41.445Z',
          updatedAt: '2023-11-15T22:12:41.445Z',
          deletedAt: null,
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
