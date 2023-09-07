import { User } from './UserTypes';

export enum SkillClass {
  STRENGTH = 'STRENGTH',
  SPEED = 'SPEED',
  TECH = 'TECH',
  NONE = 'NONE',
}

export interface Match {
  id: number;
  winner_id: number;
  p1_score: number;
  p2_score: number;
  p1_class_id: number;
  p2_class_id: number;
  date_of_creation: string;
  player_one: User;
  player_two: User;
}
