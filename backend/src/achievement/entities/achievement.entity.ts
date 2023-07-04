import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserAchievement } from 'src/user_achievements/entities/user_achievement.entity';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => UserAchievement,
    (userAchievement) => userAchievement.achievement,
  )
  userAchievements: UserAchievement[];
}
