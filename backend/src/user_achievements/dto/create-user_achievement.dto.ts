import { Achievement } from 'src/achievement/entities/achievement.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateUserAchievementDto {
  user: User;
  achievement: Achievement;
}
