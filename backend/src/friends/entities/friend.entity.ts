import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
