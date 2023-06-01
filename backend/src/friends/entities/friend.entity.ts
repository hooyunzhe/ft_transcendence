import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum FriendStatus {
  Friend = 'friend',
  Invited = 'invited',
  Pending = 'pending',
  Blocked = 'blocked',
}

export enum FriendAction {
  Block = 'block',
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
