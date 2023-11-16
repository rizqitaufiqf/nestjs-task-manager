import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';

export function SignUpSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('User Sign Up'),
    ApiCreatedResponse({
      schema: {
        example: {
          username: 'username',
          email: 'username@mail.com',
          deletedAt: null,
          id: '163c431c-487f-45a5-8720-ddba02850bbb',
          createdAt: '2023-11-15T22:10:34.484Z',
          updatedAt: '2023-11-15T22:10:34.484Z',
        },
      },
    }),
    ApiBadRequestResponse({
      schema: {
        example: {
          message: [
            'confirmPassword must match password exactly',
            'Password too weak. Password must include at least one uppercase letter, one lowercase letter, one number, and one symbol.',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
  );
}
