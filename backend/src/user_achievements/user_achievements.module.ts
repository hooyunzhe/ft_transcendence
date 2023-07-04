import { Module } from '@nestjs/common';
import { UserAchievementsService } from './user_achievements.service';
import { UserAchievementsController } from './user_achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from './entities/user_achievement.entity';
import { User } from 'src/user/entities/user.entity';
import { Achievement } from 'src/achievement/entities/achievement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievement, User, Achievement])],
  controllers: [UserAchievementsController],
  providers: [UserAchievementsService],
})
export class UserAchievementsModule {}
