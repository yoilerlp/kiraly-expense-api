import { User } from '@/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryType } from '../interfaces/category.interface';

@Entity({
  name: 'category',
})
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    nullable: false,
    unique: false,
  })
  key: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    nullable: false,
    default: CategoryType.SYSTEM,
  })
  type: CategoryType;

  @Column({
    nullable: true,
    unique: false,
    type: 'varchar',
    length: 50,
  })
  mainColor: string;

  @Column({
    nullable: true,
    unique: false,
    type: 'varchar',
    length: 50,
  })
  subColor: string;

  @Column({
    nullable: true,
    unique: false,
    type: 'varchar',
    length: 50,
  })
  icon: string;

  @Column({
    type: 'boolean',
    default: true,
    nullable: true,
  })
  isActive: boolean | null;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  userId: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
