import { applyDecorators } from '@nestjs/common';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TaskStatus } from '../../../../utils/enums/task-status.enum';

export function GetTaskIdSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('Get Task by ID'),
    ApiBearerAuth(),
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
          id: '798c3aa1-5910-4daa-8bc3-6392a37d40d5',
          title: 'Go to Market',
          description: 'Buy some vegetables and milk',
          status: 'OPEN',
        },
      },
    }),
    ApiBadRequestResponse({
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
          statusCode: { type: 'number' },
        },
        example: {
          message: '"1" is an invalid id',
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
            'Task with id: f8a76ec9-5207-469e-bf4f-3c65a9d2fbba not found',
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
