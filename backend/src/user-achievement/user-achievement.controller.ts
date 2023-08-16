import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserAchievementService } from './user-achievement.service';
import { CreateUserAchievementDto } from './dto/create-user-achievement.dto';
import { RemoveUserAchievementDto } from './dto/remove-user-achievement.dto';
import {
  UserAchievementGetQueryParams,
  UserAchievementSearchType,
} from './params/get-query-params';

@Controller('user-achievements')
export class UserAchievementController {
  constructor(
    private readonly userAchievementService: UserAchievementService,
  ) {}

  @Post()
  async create(
    @Body() userAchievementDto: CreateUserAchievementDto,
  ): Promise<UserAchievement> {
    return this.userAchievementService.create(userAchievementDto);
  }

  @Get()
  async find(
    @Query() queryParams: UserAchievementGetQueryParams,
  ): Promise<UserAchievement[] | UserAchievement> {
    switch (queryParams.search_type) {
      case UserAchievementSearchType.ALL:
        return this.userAchievementService.findAll();
      case UserAchievementSearchType.ONE:
        return this.userAchievementService.findOne(queryParams.search_number);
      case UserAchievementSearchType.USER:
        return this.userAchievementService.findAchievedByUser(
          queryParams.search_number,
        );
      case UserAchievementSearchType.ACHIEVEMENT:
        return this.userAchievementService.findAchieversByAchievement(
          queryParams.search_number,
        );
      case UserAchievementSearchType.EXACT:
        return this.userAchievementService.findExact(
          queryParams.search_number,
          queryParams.second_search_number,
        );
    }
  }

  @Delete()
  async remove(
    @Body() userAchievementDto: RemoveUserAchievementDto,
  ): Promise<void> {
    return this.userAchievementService.remove(userAchievementDto);
  }
}
