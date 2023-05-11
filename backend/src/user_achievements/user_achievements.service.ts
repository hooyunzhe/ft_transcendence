import { Injectable } from '@nestjs/common';
import { CreateUserAchievementDto } from './dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from './dto/update-user_achievement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from 'src/achievements/entities/achievement.entity';
import { Repository } from 'typeorm';
import { UserAchievement } from './entities/user_achievement.entity';

@Injectable()
export class UserAchievementsService {
  constructor(
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
  ) {}

  async create(
    createUserAchievementDto: CreateUserAchievementDto,
  ): Promise<void> {
    await this.userAchievementRepository.save(createUserAchievementDto);
  }

  async findAll(): Promise<UserAchievement[]> {
    return await this.userAchievementRepository.find();
  }

  async findOne(id: number): Promise<UserAchievement | null> {
    return await this.userAchievementRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.userAchievementRepository.delete(id);
  }
}
