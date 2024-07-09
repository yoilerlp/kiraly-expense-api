import { Account, User, TransferFile } from '@/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transfer')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    nullable: false,
    generated: 'increment',
    unique: true,
  })
  key: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  amount: number;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relations
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  originAccountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'originAccountId' })
  originAccount: Account;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  destinationAccountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'destinationAccountId' })
  destinationAccount: Account;

  // transfer files
  @OneToMany(() => TransferFile, (transferFile) => transferFile.transfer)
  transferFiles: TransferFile[];
}
