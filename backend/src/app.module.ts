import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserModule } from './user/user.module';
import { MatchHistoryModule } from './match_history/match_history.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelMembersModule } from './channel_members/channel_members.module';
import { MessageModule } from './message/message.module';
import { AchievementModule } from './achievement/achievement.module';
import { UserAchievementsModule } from './user_achievements/user_achievements.module';
import { FriendModule } from './friend/friend.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    MatchHistoryModule,
    ChannelModule,
    ChannelMembersModule,
    MessageModule,
    AchievementModule,
    UserAchievementsModule,
    FriendModule,
    GameModule,
  ],
  controllers: [],
})
export class AppModule {}
