import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  winner_id: number;

  @Column()
  p1_score: number;

  @Column()
  p2_score: number;

  @CreateDateColumn()
  date_of_creation: Date;

  @ManyToOne(() => User, (user) => user.matchesAsPlayerOne, {
    eager: true,
    onDelete: 'CASCADE',
  })
  player_one: User;

  @ManyToOne(() => User, (user) => user.matchesAsPlayerTwo, {
    eager: true,
    onDelete: 'CASCADE',
  })
  player_two: User;
}
