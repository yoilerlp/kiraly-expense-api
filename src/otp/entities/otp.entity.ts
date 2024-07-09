import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { OTPType } from '../interfaces/otp.interface';

@Entity({
  name: 'otp',
})
export class OTP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  code: string;

  @Column({
    type: 'enum',
    enum: OTPType,
    nullable: false,
    default: OTPType.FORGOT_PASSWORD,
  })
  type: OTPType;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  expiresAt: Date;

  @Column({
    type: 'text',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => User)
  @JoinTable({
    name: 'userId',
  })
  user: User;
}
