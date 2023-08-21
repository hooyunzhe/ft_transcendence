import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  wins: number;

  @Column()
  losses: number;

  @Column()
  current_winstreak: number;

  @Column()
  highest_winstreak: number;

  @Column()
  strength_count: number;

  @Column()
  speed_count: number;

  @Column()
  tech_count: number;

  @OneToOne(() => User, (user) => user.statistic, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
