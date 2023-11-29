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
        example: {
          message: 'logout successfully',
        },
      },
    }),
    ApiUnauthorizedResponse({
      schema: {
        example: {
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
  );
}
