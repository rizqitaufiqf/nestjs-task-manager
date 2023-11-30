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
import { Task } from './entities/task.entity';
import { TaskStatus } from '../utils/enums/task-status.enum';
import { User } from '../users/entities/user.entity';
import { UuidValidationPipe } from '../utils/pipes/uuid.validation.pipe';
import { TaskStatusValidationPipe } from '../utils/pipes/task-status.validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../utils/decorators/params/get-current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetTasksSwaggerDecorator } from './decorators/functions/swagger/get-tasks.decorator';
import { GetTaskIdSwaggerDecorator } from './decorators/functions/swagger/get-task-id.decorator';

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

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id', UuidValidationPipe) id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetCurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatusById(id, status, user);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTaskById(
    @Param('id', UuidValidationPipe) id: string,
    @GetCurrentUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
  }
}
