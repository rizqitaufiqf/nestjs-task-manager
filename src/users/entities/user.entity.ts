import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Task } from '../../tasks/entities/task.entity';

@Entity('user')
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  email: string | null;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  salt: string;

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
