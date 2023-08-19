import { Achievement } from './AchievementTypes';
import { User } from './UserTypes';

export interface UserAchievement {
  id: number;
  date_of_creation: string;
  user: User;
  achievement: Achievement;
}
