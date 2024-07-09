import { User } from '@/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountType } from '../interfaces/account.interface';

@Entity({
  name: 'account',
})
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    width: 255,
    nullable: false,
  })
  name: string;

  @Column({
    unique: true,
    generated: 'increment',
    type: 'integer',
  })
  key: number;

  @Column({
    type: 'enum',
    enum: AccountType,
    nullable: false,
  })
  type: AccountType;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;
}
