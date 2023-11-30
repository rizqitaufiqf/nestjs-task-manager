import { applyDecorators } from '@nestjs/common';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TaskStatus } from '../../../../utils/enums/task-status.enum';

export function CreateTaskSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('Create task'),
    ApiBearerAuth(),
    ApiCreatedResponse({
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: Object.values(TaskStatus) },
          userId: { type: 'string', format: 'uuid' },
          id: { type: 'string', format: 'uuid' },
        },
        example: {
          title: 'Go to Market',
          description: 'Buy some vegetables and milk',
          status: 'OPEN',
          userId: '38d0fa1d-b25d-444b-b39f-40754c8c3df8',
          id: '1f20efff-3061-4a5f-9f86-528a7d930b64',
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
            'title should not be empty',
            'description should not be empty',
          ],
          error: 'Bad Request',
          statusCode: 400,
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
