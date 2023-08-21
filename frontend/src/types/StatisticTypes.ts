import { User } from './UserTypes';

export interface Statistic {
  id: number;
  wins: number;
  losses: number;
  current_winstreak: number;
  highest_winstreak: number;
  strength_count: number;
  speed_count: number;
  tech_count: number;
  user: User;
}
