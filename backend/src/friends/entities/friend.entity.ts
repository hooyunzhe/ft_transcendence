import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FriendStatus } from '../friends.enum';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  p1_uid: string;

  @Column()
  p2_uid: string;

  @Column()
  status: FriendStatus;
}
