import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelMember } from 'src/channel_members/entities/channel_member.entity';
import { Message } from 'src/messages/entities/message.entity';

export enum ChannelType {
  Public = 'public',
  Private = 'private',
  Protected = 'protected',
  Direct = 'direct',
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: ChannelType.Public })
  type: ChannelType;

  @Column({ default: null })
  hash: string;

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.channel)
  channelMembers: ChannelMember[];

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
}
