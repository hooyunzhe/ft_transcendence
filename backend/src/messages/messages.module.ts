import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Channel])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
