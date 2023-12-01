import { applyDecorators } from '@nestjs/common';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TaskStatus } from '../../../../utils/enums/task-status.enum';

export function UpdateTaskSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('Update task status'),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: 'uuid' }),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: Object.values(TaskStatus) },
        },
        example: {
          id: '09818032-c0d8-4466-9c5c-c58788e90dec',
          title: 'Go to Market',
          description: 'Buy some vegetables and milk',
          status: 'DONE',
        },
      },
    }),
    ApiBadRequestResponse({
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'array',
            items: { type: 'string' },
          },
          error: { type: 'string' },
          statusCode: { type: 'number' },
        },
        example: {
          message: [
            'status must be one of the following values: OPEN, IN_PROGRESS, DONE',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
    ApiNotFoundResponse({
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
          statusCode: { type: 'number' },
        },
        example: {
          message:
            'Task with id: 09818032-c0d8-4466-9c5c-c58788e90dea not found',
          error: 'Not Found',
          statusCode: 404,
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
