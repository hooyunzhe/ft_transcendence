import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

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
    onDelete: 'CASCADE',
  })
  outgoing_friend: User;

  @ManyToOne(() => User, (user) => user.incomingFriendships, {
    eager: true,
    onDelete: 'CASCADE',
  })
  incoming_friend: User;

  @Column()
  status: FriendStatus;
}
