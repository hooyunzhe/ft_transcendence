import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum ChannelMemberRole {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
}

export enum ChannelMemberStatus {
  Banned = 'banned',
  Muted = 'muted',
}

@Entity()
export class ChannelMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: ChannelMemberRole.Member })
  role: ChannelMemberRole;

  @Column({ default: null })
  status: ChannelMemberStatus;

  @Column({ default: null })
  muted_until: Date;

  @ManyToOne(() => Channel, (channel) => channel.channelMembers, {
    eager: true,
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.channelMembers, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
