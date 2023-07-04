import { AchievementModule } from 'src/achievement/achievement.module';
import { Achievement } from 'src/achievement/entities/achievement.entity';
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
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.userAchievements, {
    eager: true,
    onDelete: 'CASCADE',
  })
  achievement: Achievement;
}
