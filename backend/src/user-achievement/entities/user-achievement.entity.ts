import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Achievement } from 'src/achievement/entities/achievement.entity';

@Unique('user-achievement', ['user', 'achievement'])
@Entity()
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date_of_creation: Date;

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
