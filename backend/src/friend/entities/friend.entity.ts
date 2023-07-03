import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum FriendStatus {
  FRIENDS = 'FRIENDS',
  INVITED = 'INVITED',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

export enum FriendAction {
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}

@Unique('friendship', ['outgoing_friend', 'incoming_friend'])
@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.outgoingFriendships, {
    eager: true,
  })
  outgoing_friend: User;

  @ManyToOne(() => User, (user) => user.incomingFriendships, {
    eager: true,
  })
  incoming_friend: User;

  @Column()
  status: FriendStatus;
}
