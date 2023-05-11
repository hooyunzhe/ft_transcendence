import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  controllers: [AchievementsController],
  providers: [AchievementsService],
})
export class AchievementsModule {}
