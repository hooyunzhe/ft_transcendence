import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}
