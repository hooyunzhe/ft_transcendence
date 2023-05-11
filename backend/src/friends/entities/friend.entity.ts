import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum FriendStatus {
  Friend = "friend",
  Invited = "invited",
  Pending = "pending",
  Blocked = "blocked",
}

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  p1_uid: number;

  @Column()
  p2_uid: number;

  @Column()
  status: FriendStatus;
}
