import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { MatchHistoryModule } from './match_history/match_history.module';
import { AchievementsModule } from './achievements/achievements.module';
import { UserAchievementsModule } from './user_achievements/user_achievements.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    MatchHistoryModule,
    AchievementsModule,
    UserAchievementsModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
