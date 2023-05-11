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
import { Achievement } from './entities/achievement.entity';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
// import { UpdateAchievementDto } from './dto/update-achievement.dto';

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
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Achievement | null> {
    return this.achievementsService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAchievementDto: UpdateAchievementDto,
  // ) {
  //   return this.achievementsService.update(+id, updateAchievementDto);
  // }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.achievementsService.remove(id);
  }
}
