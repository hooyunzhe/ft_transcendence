import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserAchievementController } from './user-achievement.controller';
import { UserAchievementService } from './user-achievement.service';
import { UserModule } from 'src/user/user.module';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAchievement]),
    UserModule,
    AchievementModule,
  ],
  controllers: [UserAchievementController],
  providers: [UserAchievementService],
})
export class UserAchievementModule {}
