import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/entities/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum ChannelRole {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
}

export enum ChannelStatus {
  Banned = 'banned',
  Muted = 'muted',
}

export class UserChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channel_id: number;

  @Column()
  user_id: number;

  @Column({ default: ChannelRole.Member })
  role: ChannelRole;

  @Column({ default: null })
  status: ChannelStatus;

  @Column({ default: null })
  muted_until: Date;

  @ManyToOne(() => User, (user) => user.userChannels)
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.userChannels)
  channel: Channel;
}
