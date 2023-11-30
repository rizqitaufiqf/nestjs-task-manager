import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from '../../utils/enums/task-status.enum';
import { User } from '../../users/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity('task')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  user: User;

  @Column()
  @Exclude({ toPlainOnly: true })
  userId: string;
}
