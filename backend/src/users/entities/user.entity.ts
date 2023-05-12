import { UserChannel } from 'src/channel_users/entities/channel_user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  intra_uid: string;

  @Column()
  username: string;

  @CreateDateColumn()
  date_of_creation: Date;

  @Column({ default: 'offline' })
  status: string;

  @OneToMany(() => UserChannel, (userChannel) => userChannel.user)
  userChannels: UserChannel[];
}
