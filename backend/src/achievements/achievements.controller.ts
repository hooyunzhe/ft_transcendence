import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Achievement } from './entities/achievement.entity';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  create(@Body() createAchievementDto: CreateAchievementDto): Promise<void> {
    return this.achievementsService.create(createAchievementDto);
  }

  @Get()
  findAll(): Promise<Achievement[]> {
    return this.achievementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Achievement> {
    return this.achievementsService.findOne(id);
  }

  @Get(':id/achievers')
  findAchievers(@Param('id') id: number): Promise<User[]> {
    return this.achievementsService.findAchievers(id);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.achievementsService.remove(id);
  }
}
