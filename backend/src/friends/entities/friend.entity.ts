import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum FriendStatus {
  Friend = "friend",
  Invited = "invited",
  Pending = "pending",
  Blocked = "blocked",
  Accept = "accept",
  Deny = "deny",
}

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user1_id: number;

  @Column()
  user2_id: number;

  @Column()
  status: FriendStatus;
}
