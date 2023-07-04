import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { Achievement } from './entities/achievement.entity';
import { AchievementService } from './achievement.service';
import { User } from 'src/user/entities/user.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { RemoveAchievementDto } from './dto/remove-achievement.dto';
import {
  AchievementGetQueryParams,
  AchievementSearchType,
} from './params/get-query-params';

@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  async create(
    @Body() achievementDto: CreateAchievementDto,
  ): Promise<Achievement> {
    return this.achievementService.create(achievementDto);
  }

  @Get()
  async find(
    @Query() queryParams: AchievementGetQueryParams,
  ): Promise<User[] | Achievement[] | Achievement | null> {
    switch (queryParams.search_type) {
      case AchievementSearchType.ALL:
        return this.achievementService.findAll(queryParams.load_relations);
      case AchievementSearchType.ONE:
        return this.achievementService.findOne(
          queryParams.search_number,
          queryParams.load_relations,
        );
      case AchievementSearchType.NAME:
        return this.achievementService.findByName(
          queryParams.search_string,
          queryParams.load_relations,
        );
      case AchievementSearchType.RELATION:
        return this.achievementService.getRelations(
          queryParams.search_number,
          queryParams.search_relation,
        );
    }
  }

  @Patch()
  async update(@Body() achievementDto: UpdateAchievementDto): Promise<void> {
    this.achievementService.update(achievementDto);
  }

  @Delete()
  async remove(@Body() achievementDto: RemoveAchievementDto): Promise<void> {
    this.achievementService.remove(achievementDto);
  }
}
