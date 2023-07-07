import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './entities/channel-member.entity';
import { ChannelMemberController } from './channel-member.controller';
import { ChannelMemberService } from './channel-member.service';
import { ChannelModule } from 'src/channel/channel.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelMember]),
    ChannelModule,
    UserModule,
  ],
  controllers: [ChannelMemberController],
  providers: [ChannelMemberService],
})
export class ChannelMemberModule {}
