import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Go to Market', description: 'Task title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Buy some vegetables and milk',
    description: 'Task description',
  })
  @IsNotEmpty()
  description: string;
}
