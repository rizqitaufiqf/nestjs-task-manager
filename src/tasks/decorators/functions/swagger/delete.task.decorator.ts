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

export function DeleteTaskSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('Delete task'),
    ApiBearerAuth(),
    ApiParam({ name: 'id', type: 'uuid' }),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
        example: {
          message: 'Task deleted successfully',
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
          message: '"09818032-c0d8-4466-9c5c-c58788e90deca" is an invalid id',
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
