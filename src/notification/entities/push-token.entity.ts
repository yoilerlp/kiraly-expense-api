import { User } from '@/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PushToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false })
  token: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true })
  deviceInfo?: string;

  @CreateDateColumn()
  createdAt: Date;
}
