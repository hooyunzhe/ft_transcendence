import { Achievement } from 'src/achievements/entities/achievement.entity';
import { UserAchievement } from 'src/user_achievements/entities/user_achievement.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ChannelMember } from 'src/channel_members/entities/channel_member.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  intra_uid: string;

  @Column()
  username: string;

  @CreateDateColumn()
  date_of_creation: Date;

  @Column({ default: 'offline' })
  status: string;

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.user)
  channelMembers: ChannelMember[];
  
  @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.user)
  userAchievements: UserAchievement[];
}
