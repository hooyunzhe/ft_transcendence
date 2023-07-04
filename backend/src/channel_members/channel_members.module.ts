import { Module } from '@nestjs/common';
import { ChannelMembersService } from './channel_members.service';
import { ChannelMembersController } from './channel_members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './entities/channel_member.entity';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMember]), ChannelModule],
  controllers: [ChannelMembersController],
  providers: [ChannelMembersService],
})
export class ChannelMembersModule {}
