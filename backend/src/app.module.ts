import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { MatchHistoryModule } from './match_history/match_history.module';
import { ChannelsModule } from './channels/channels.module';
import { ChannelMembersModule } from './channel_members/channel_members.module';
import { MessagesModule } from './messages/messages.module';
import { AchievementsModule } from './achievements/achievements.module';
import { UserAchievementsModule } from './user_achievements/user_achievements.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    MatchHistoryModule,
    ChannelsModule,
    ChannelMembersModule,
    MessagesModule,
    AchievementsModule,
    UserAchievementsModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
