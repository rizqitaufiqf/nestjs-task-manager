import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';

export function SignUpSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('User Sign Up'),
    ApiCreatedResponse({
      schema: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          email: { oneOf: [{ type: 'string' }, { type: 'null' }] },
          id: { type: 'string', format: 'uuid' },
        },
        example: {
          username: 'username',
          email: 'username@mail.com',
          id: '163c431c-487f-45a5-8720-ddba02850bbb',
        },
      },
    }),
    ApiConflictResponse({
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
          statusCode: { type: 'number' },
        },
        example: {
          message: 'Username already exists',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    }),
    ApiBadRequestResponse({
      schema: {
        type: 'object',
        properties: {
          message: { type: 'array', items: { type: 'string' } },
          error: { type: 'string' },
          statusCode: { type: 'number' },
        },
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
