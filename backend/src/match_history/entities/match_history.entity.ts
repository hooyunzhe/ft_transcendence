import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  date_of_creation: Date;
}
