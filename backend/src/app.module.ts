import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { AchievementModule } from './achievement/achievement.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelMemberModule } from './channel-member/channel-member.module';
import { FriendModule } from './friend/friend.module';
import { GameModule } from './game/game.module';
import { MatchModule } from './match/match.module';
import { MessageModule } from './message/message.module';
import { StatisticModule } from './statistic/statistic.module';
import { UserModule } from './user/user.module';
import { UserAchievementModule } from './user-achievement/user-achievement.module';

@Module({
  imports: [
    DatabaseModule,
    AchievementModule,
    ChannelModule,
    ChannelMemberModule,
    FriendModule,
    GameModule,
    MatchModule,
    MessageModule,
    StatisticModule,
    UserModule,
    UserAchievementModule,
  ],
  controllers: [],
})
export class AppModule {}
