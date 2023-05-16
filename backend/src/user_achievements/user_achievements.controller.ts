import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserAchievementsService } from './user_achievements.service';
import { UserAchievement } from './entities/user_achievement.entity';

@Controller('user_achievements')
export class UserAchievementsController {
  constructor(
    private readonly userAchievementsService: UserAchievementsService,
  ) {}

  @Post()
  create(
    @Body('user_id', ParseIntPipe) user_id: number,
    @Body('achievement_id', ParseIntPipe) achievement_id: number,
  ) {
    return this.userAchievementsService.create(user_id, achievement_id);
  }

  @Get()
  findAll(): Promise<UserAchievement[]> {
    return this.userAchievementsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserAchievement | null> {
    return this.userAchievementsService.findOne(id);
  }

  @Get('user/:user_id')
  getAchievedByUser(
    @Param('user_id', ParseIntPipe) id: number,
  ): Promise<UserAchievement[]> {
    return this.userAchievementsService.getAchievedByUser(id);
  }

  @Get('achievement/:achievement_id')
  getAchieverByAchievement(
    @Param('achievement_id', ParseIntPipe) id: number,
  ): Promise<UserAchievement[]> {
    return this.userAchievementsService.AchieverByAchievement(id);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userAchievementsService.remove(id);
  }
}
