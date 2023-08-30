import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Preference } from 'src/preference/entities/preference.entity';
import { TwoFactor } from 'src/two-factor/entities/two-factor.entity';
import { Statistic } from 'src/statistic/entities/statistic.entity';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { Message } from 'src/message/entities/message.entity';
import { UserAchievement } from 'src/user-achievement/entities/user-achievement.entity';
import { Friend } from 'src/friend/entities/friend.entity';
import { Match } from 'src/match/entities/match.entity';

export enum UserStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  IN_GAME = 'IN_GAME',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  intra_id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  refresh_token: string;

  @Column()
  avatar_url: string;

  @Column({ default: false })
  two_factor_enabled: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  date_of_creation: Date;

  @OneToOne(() => Preference, (preference) => preference.user)
  preference: Preference;

  @OneToOne(() => TwoFactor, (twoFactor) => twoFactor.user)
  twoFactor: TwoFactor;

  @OneToOne(() => Statistic, (statistic) => statistic.user)
  statistic: Statistic;

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
