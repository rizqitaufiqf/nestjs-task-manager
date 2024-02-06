import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from '../utils/enums/task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Task, User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasks(
    { status, search }: GetTaskFilterDto,
    user: User,
  ): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: {
        userId: user.id,
        ...(status && { status }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
    });
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found: Task = await this.prisma.task.findUnique({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return found;
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Partial<Task>> {
    return await this.prisma.task.create({
      data: {
        title,
        description,
        status: TaskStatus.OPEN,
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
      },
    });
  }

  async updateTaskStatusById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    await this.getTaskById(id, user);
    return await this.prisma.task.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        status: status,
      },
    });
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    await this.getTaskById(id, user);

    await this.prisma.task.delete({
      where: { id, userId: user.id },
    });
  }
}
