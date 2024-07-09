import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    generated: 'increment',
    type: 'integer',
  })
  key: string;

  @Column({
    length: 60,
  })
  name: string;

  @Column({
    length: 60,
  })
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    default: false,
  })
  isActive: boolean;
}
