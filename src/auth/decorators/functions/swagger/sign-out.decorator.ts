import { applyDecorators } from '@nestjs/common';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SignOutSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('User Sign out'),
    ApiBearerAuth(),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
        example: {
          message: 'logout successfully',
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
