import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'file',
})
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  key: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  @Column({ type: 'text', nullable: false })
  url: string;

  @Column({ type: 'int', nullable: false })
  size: number;
}
