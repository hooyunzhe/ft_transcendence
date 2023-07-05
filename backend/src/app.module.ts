import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelMembersModule } from './channel_members/channel_members.module';
import { MessageModule } from './message/message.module';
import { AchievementModule } from './achievement/achievement.module';
import { UserAchievementModule } from './user-achievement/user-achievement.module';
import { FriendModule } from './friend/friend.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    MatchModule,
    ChannelModule,
    ChannelMembersModule,
    MessageModule,
    AchievementModule,
    UserAchievementModule,
    FriendModule,
    GameModule,
  ],
  controllers: [],
})
export class AppModule {}
