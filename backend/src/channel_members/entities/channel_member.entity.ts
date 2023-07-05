import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum ChannelMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum ChannelMemberStatus {
  BANNED = 'BANNED',
  MUTED = 'MUTED',
  DEFAULT = 'DEFAULT',
}

@Entity()
export class ChannelMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: ChannelMemberRole.MEMBER })
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
