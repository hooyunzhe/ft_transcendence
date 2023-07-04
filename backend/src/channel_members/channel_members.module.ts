import { Module } from '@nestjs/common';
import { ChannelMembersService } from './channel_members.service';
import { ChannelMembersController } from './channel_members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './entities/channel_member.entity';
import { ChannelMembersGateway } from './channel_members.gateway';
import { ChannelsModule } from 'src/channels/channels.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMember]), ChannelsModule, UsersModule],
  controllers: [ChannelMembersController],
  providers: [ChannelMembersService, ChannelMembersGateway],
})
export class ChannelMembersModule { }
