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
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          username: { type: 'string' },
          email: {
            oneOf: [{ type: 'string', format: 'email' }, { type: 'null' }],
          },
          tasks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                title: { type: 'string' },
                description: { type: 'string' },
                status: {
                  type: 'string',
                  enum: ['OPEN', 'IN_PROGRESS', 'DONE'],
                },
              },
            },
          },
        },
        example: {
          id: 'dc4f688d-6c65-4aa3-a1aa-4ea80c59b199',
          username: 'user_name',
          email: null,
          tasks: [
            {
              id: '09818032-c0d8-4466-9c5c-c58788e90dec',
              title: 'Go to Market',
              description: 'Buy some vegetables and milk',
              status: 'DONE',
            },
          ],
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
