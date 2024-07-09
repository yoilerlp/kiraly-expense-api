import { File, Transfer } from '@/entities';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transfer_file')
export class TransferFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => File, {
    eager: true,
  })
  @JoinColumn({ name: 'fileId' })
  file: File;

  @ManyToOne(() => Transfer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transferId' })
  transfer: Transfer;
}
