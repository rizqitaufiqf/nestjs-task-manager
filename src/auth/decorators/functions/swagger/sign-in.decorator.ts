import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { BaseSwaggerDecorator } from '../../../../utils/decorators/functions/swagger/base.decorator';

export function SignInSwaggerDecorator() {
  return applyDecorators(
    BaseSwaggerDecorator('User Sign In'),
    ApiOkResponse({
      schema: {
        example: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI5MjZmMzg2LWJiY2EtNGQzNy04MTlkLWE3NDJlMzZlODQ5ZiIsInVzZXJuYW1lIjoicmVyZSIsImF1dGhfb3JpZ2luIjoidXNlcl9jcmVkZW50aWFscyIsImlhdCI6MTcwMDEwNzM5MywiZXhwIjoxNzAwMTA3NjkzfQ.EwEo7aqxCXvjYr6EEIZG8Go7NgZZmOe4m1lRbxQ3tEk',
          refreshToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI5MjZmMzg2LWJiY2EtNGQzNy04MTlkLWE3NDJlMzZlODQ5ZiIsInVzZXJuYW1lIjoicmVyZSIsImlhdCI6MTcwMDEwNzM5MywiZXhwIjoxNzAwMTA3OTkzfQ.GSoM8JKam3gYF7kNCcTOGAlUUQkiosa60K8byuIjfJA',
          expiresToken: 1700107693100,
        },
      },
    }),
    ApiUnauthorizedResponse({
      schema: {
        example: {
          message: 'Invalid username or password',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
  );
}
