import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MessageType {
  Text = 'text',
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
  })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.messages, {
    eager: true,
  })
  user: User;
}
