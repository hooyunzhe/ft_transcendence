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

  @Column()
  skill1_id: number;

  @Column()
  skill2_id: number;

  @Column()
  skill3_id: number;

  @Column()
  skill4_id: number;

  @Column()
  skill5_id: number;

  @CreateDateColumn({ type: 'timestamptz' })
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
