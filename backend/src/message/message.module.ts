import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ChannelModule } from 'src/channel/channel.module';
import { UserModule } from 'src/user/user.module';
import { ChannelMemberModule } from 'src/channel-member/channel-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ChannelModule,
    UserModule,
    ChannelMemberModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
