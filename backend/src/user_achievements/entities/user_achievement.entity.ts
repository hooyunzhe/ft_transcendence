import { AchievementsModule } from 'src/achievements/achievements.module';
import { Achievement } from 'src/achievements/entities/achievement.entity';
import { User } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  creationDate: Date;

  @ManyToOne(() => User, (user) => user.userAchievements, {
    eager: true,
  })
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.userAchievements, {
    eager: true,
  })
  achievement: Achievement;
}
