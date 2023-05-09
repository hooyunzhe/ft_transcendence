import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  intra_uid: string;

  @Column()
  username: string;

  @Column()
  date_of_creation: Date;

  @Column({ default: 'offline' })
  status: string;
}
