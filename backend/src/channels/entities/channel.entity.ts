import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ChannelType {
  Public = 'public',
  Private = 'private',
  Protected = 'protected',
  Direct = 'direct',
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: ChannelType;

  @Column({ default: null })
  hash: string;
}
