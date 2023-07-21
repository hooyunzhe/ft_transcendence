import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { AchievementModule } from './achievement/achievement.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelMemberModule } from './channel-member/channel-member.module';
import { FriendModule } from './friend/friend.module';
import { GameModule } from './game/game.module';
<<<<<<< HEAD
// import { MatchmakingModule } from './matchmaking/matchmaking.module';
=======
import { MatchModule } from './match/match.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { UserAchievementModule } from './user-achievement/user-achievement.module';
>>>>>>> 47abc119b3eb50e5874a2010d07e291fce0dacb5

@Module({
  imports: [
    DatabaseModule,
<<<<<<< HEAD
    UsersModule,
    MatchHistoryModule,
    ChannelsModule,
    ChannelMembersModule,
    MessagesModule,
    AchievementsModule,
    UserAchievementsModule,
    FriendsModule,
    GameModule,
    // MatchmakingModule,
=======
    AchievementModule,
    ChannelModule,
    ChannelMemberModule,
    FriendModule,
    GameModule,
    MatchModule,
    MessageModule,
    UserModule,
    UserAchievementModule,
>>>>>>> 47abc119b3eb50e5874a2010d07e291fce0dacb5
  ],
  controllers: [],
})
export class AppModule {}
