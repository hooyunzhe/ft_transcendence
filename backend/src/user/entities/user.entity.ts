import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ChannelMember } from 'src/channel_members/entities/channel_member.entity';
import { Message } from 'src/message/entities/message.entity';
import { UserAchievement } from 'src/user-achievement/entities/user-achievement.entity';
import { Friend } from 'src/friend/entities/friend.entity';
import { Match } from 'src/match/entities/match.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  refresh_token: string;

  @CreateDateColumn()
  date_of_creation: Date;

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.user)
  channelMembers: ChannelMember[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.user)
  userAchievements: UserAchievement[];

  @OneToMany(() => Friend, (friend) => friend.outgoing_friend)
  outgoingFriendships: Friend[];

  @OneToMany(() => Friend, (friend) => friend.incoming_friend)
  incomingFriendships: Friend[];

  @OneToMany(() => Match, (match) => match.player_one)
  matchesAsPlayerOne: Match[];

  @OneToMany(() => Match, (match) => match.player_two)
  matchesAsPlayerTwo: Match[];
}
