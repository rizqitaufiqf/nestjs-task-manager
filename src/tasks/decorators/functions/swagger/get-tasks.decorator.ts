import { applyDecorators } from '@nestjs/common';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TaskStatus } from '../../../../utils/enums/task-status.enum';

export function GetTasksSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('Get All Tasks'),
    ApiBearerAuth(),
    ApiOkResponse({
      schema: {
        oneOf: [
          {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                title: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string', enum: Object.values(TaskStatus) },
              },
            },
            example: [
              {
                id: '798c3aa1-5910-4daa-8bc3-6392a37d40d5',
                title: 'Go to Market',
                description: 'Buy some vegetables and milk',
                status: 'Done',
              },
              {
                id: '6d09a50e-1a3b-4bdc-b403-f45dee72d742',
                title: 'Do Homework',
                description: 'Complete your Math Homework',
                status: 'OPEN',
              },
            ],
          },
          {
            type: 'array',
            example: [],
          },
        ],
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
