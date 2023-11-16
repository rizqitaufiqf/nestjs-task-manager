import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOperation } from '@nestjs/swagger';

export function BaseSwaggerDecorator(apiOperation: string) {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      schema: {
        example: {
          error: 'Internal Server Error',
          statusCode: 500,
        },
      },
    }),
    ApiOperation({ summary: apiOperation }),
  );
}
