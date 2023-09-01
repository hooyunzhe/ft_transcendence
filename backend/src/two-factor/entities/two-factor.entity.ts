import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class TwoFactor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  secret_key: string;

  @CreateDateColumn({ type: 'timestamptz' })
  date_of_creation: Date;

  @OneToOne(() => User, (user) => user.twoFactor, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
