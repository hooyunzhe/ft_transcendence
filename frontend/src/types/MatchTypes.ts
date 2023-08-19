import { User } from './UserTypes';

export enum SkillPath {
  STRENGTH = 'STRENGTH',
  SPEED = 'SPEED',
  TECH = 'TECH',
}

export interface Match {
  id: number;
  winner_id: number;
  p1_score: number;
  p2_score: number;
  p1_skills: string;
  p2_skills: string;
  date_of_creation: string;
  player_one: User;
  player_two: User;
}
