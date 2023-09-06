import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  music_enabled: boolean;

  @Column({ default: true })
  animations_enabled: boolean;

  @OneToOne(() => User, (user) => user.preference, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
