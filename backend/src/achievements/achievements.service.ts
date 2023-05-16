import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from 'src/user_achievements/entities/user_achievement.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
  ) {}

  async create(createAchievementDto: CreateAchievementDto): Promise<void> {
    await this.achievementRepository.save(createAchievementDto);
  }

  async findAll(): Promise<Achievement[]> {
    return await this.achievementRepository.find();
  }

  async findOne(id: number): Promise<Achievement | null> {
    return await this.achievementRepository.findOneBy({ id });
  }

  async findAchievers(id: number): Promise<User[]> {
    let currentAchievement = await this.achievementRepository.findOne({
      relations: {
        userAchievements: true,
      },
      where: { id },
    });

    return currentAchievement.userAchievements.map(
      (UserAchievement) => UserAchievement.user,
    );
  }

  async remove(id: number): Promise<void> {
    await this.achievementRepository.delete(id);
  }
}
