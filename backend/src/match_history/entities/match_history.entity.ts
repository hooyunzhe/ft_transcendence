import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class MatchHistory {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  winner_uid: number;

  @Column()
  p1_uid: number;

  @Column()
  p2_uid: number;

  @Column()
  p1_score: number;

  @Column()
  p2_score: number;

  @CreateDateColumn()
  date_of_creation: Date;
}
