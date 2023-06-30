import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum FriendStatus {
  Friends = 'friends',
  Invited = 'invited',
  Pending = 'pending',
  Blocked = 'blocked',
}

export enum FriendAction {
  Block = 'block',
  Unblock = 'unblock',
  Accept = 'accept',
  Reject = 'reject',
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
