import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserModule } from './user/user.module';
import { MatchHistoryModule } from './match_history/match_history.module';
import { ChannelsModule } from './channels/channels.module';
import { ChannelMembersModule } from './channel_members/channel_members.module';
import { MessagesModule } from './messages/messages.module';
import { AchievementsModule } from './achievements/achievements.module';
import { UserAchievementsModule } from './user_achievements/user_achievements.module';
import { FriendModule } from './friend/friend.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    MatchHistoryModule,
    ChannelsModule,
    ChannelMembersModule,
    MessagesModule,
    AchievementsModule,
    UserAchievementsModule,
    FriendModule,
    GameModule,
  ],
  controllers: [],
})
export class AppModule {}
