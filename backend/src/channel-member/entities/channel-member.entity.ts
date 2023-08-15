import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from 'src/channel/entities/channel.entity';
import { User } from 'src/user/entities/user.entity';

export enum ChannelMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum ChannelMemberStatus {
  DEFAULT = 'DEFAULT',
  BANNED = 'BANNED',
  MUTED = 'MUTED',
}

@Unique('channel-member', ['channel', 'user'])
@Entity()
export class ChannelMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: ChannelMemberRole;

  @Column({ default: ChannelMemberStatus.DEFAULT })
  status: ChannelMemberStatus;

  @Column({ default: null })
  muted_until: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  date_of_creation: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  last_updated: Date;

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
