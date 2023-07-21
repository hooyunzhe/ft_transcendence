import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from 'src/channel/entities/channel.entity';
import { User } from 'src/user/entities/user.entity';

export enum MessageType {
  TEXT = 'TEXT',
  INVITE = 'INVITE',
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  type: MessageType;

  @CreateDateColumn()
  date_of_creation: Date;

  @ManyToOne(() => Channel, (channel) => channel.messages, {
    eager: true,
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.messages, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
