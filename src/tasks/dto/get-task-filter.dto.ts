import { TaskStatus } from '../../utils/enums/task-status.enum';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTaskFilterDto {
  @ApiProperty({
    example: 'DONE',
    description: 'Task status',
    enum: TaskStatus,
    required: false,
  })
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @ApiProperty({ example: 'Go to Market', required: false })
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
