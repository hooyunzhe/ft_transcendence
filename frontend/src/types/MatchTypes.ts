import { User } from './UserTypes';

export interface Match {
  id: number;
  winner_id: number;
  p1_score: number;
  p2_score: number;
  skill1_id: number;
  skill2_id: number;
  skill3_id: number;
  skill4_id: number;
  skill5_id: number;
  date_of_creation: string;
  player_one: User;
  player_two: User;
}
