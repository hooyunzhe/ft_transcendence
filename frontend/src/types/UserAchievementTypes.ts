import { Achievement } from './AchievementTypes';
import { User } from './UserTypes';

export interface UserAchievement {
  id: number;
  user: User;
  achievement: Achievement;
}
