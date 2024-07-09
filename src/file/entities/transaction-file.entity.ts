import { Transaction, File } from '@/entities';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transaction_file')
export class TransactionFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => File, {
    eager: true,
  })
  @JoinColumn({ name: 'fileId' })
  file: File;

  @ManyToOne(() => Transaction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;
}
