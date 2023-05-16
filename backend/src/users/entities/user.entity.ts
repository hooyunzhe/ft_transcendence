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

  @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.user)
  userAchievements: UserAchievement[];
}
