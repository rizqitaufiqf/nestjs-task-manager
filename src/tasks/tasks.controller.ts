import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { TasksService } from './tasks.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

import { UuidValidationPipe } from '../utils/pipes/uuid.validation.pipe';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { GetCurrentUser } from '../utils/decorators/params/get-current-user.decorator';

import { ApiTags } from '@nestjs/swagger';
import { GetTasksSwaggerDecorator } from './decorators/functions/swagger/get-tasks.decorator';
import { GetTaskIdSwaggerDecorator } from './decorators/functions/swagger/get-task-id.decorator';
import { CreateTaskSwaggerDecorator } from './decorators/functions/swagger/create-task.decorator';
import { UpdateTaskSwaggerDecorator } from './decorators/functions/swagger/update-task.decorator';
import { DeleteTaskSwaggerDecorator } from './decorators/functions/swagger/delete.task.decorator';
import { Task, User } from '@prisma/client';

@ApiTags('Task')
@Controller({
  path: 'tasks',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class TasksController {
  private logger = new Logger('TaskController');

  constructor(private tasksService: TasksService) {}

  @GetTasksSwaggerDecorator()
  @Get()
  @UsePipes(ValidationPipe)
  getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetCurrentUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @GetTaskIdSwaggerDecorator()
  @Get('/:id')
  getTaskById(
    @Param('id', UuidValidationPipe) id: string,
    @GetCurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @CreateTaskSwaggerDecorator()
  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetCurrentUser() user: User,
  ): Promise<Partial<Task>> {
    this.logger.verbose(
      `User "${user.username}" creating task. ${JSON.stringify(createTaskDto)}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @UpdateTaskSwaggerDecorator()
  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id', UuidValidationPipe) id: string,
    @Body() body: UpdateTaskStatusDto,
    @GetCurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatusById(id, body.status, user);
  }

  @DeleteTaskSwaggerDecorator()
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteTaskById(
    @Param('id', UuidValidationPipe) id: string,
    @GetCurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.tasksService.deleteTaskById(id, user);
    return { message: 'Task deleted successfully' };
  }
}
