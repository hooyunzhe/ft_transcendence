import { Module } from '@nestjs/common';
import { UserAchievementsService } from './user_achievements.service';
import { UserAchievementsController } from './user_achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from './entities/user_achievement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievement])],
  controllers: [UserAchievementsController],
  providers: [UserAchievementsService],
})
export class UserAchievementsModule {}
