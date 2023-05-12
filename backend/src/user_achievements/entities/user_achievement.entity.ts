import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  achievement_id: number;
}
