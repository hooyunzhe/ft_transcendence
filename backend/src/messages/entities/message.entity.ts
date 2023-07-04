import { Channel } from 'src/channel/entities/channel.entity';
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
  sender_id: number;

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
}
