import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from '../utils/enums/task-status.enum';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(
    { status, search }: GetTaskFilterDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId ', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description Like :search)',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Partial<Task>> {
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user: _, ...rest } = task;
    return rest;
  }
}
