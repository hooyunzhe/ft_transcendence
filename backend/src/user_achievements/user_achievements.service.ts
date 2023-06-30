import { Injectable } from '@nestjs/common';
import { CreateUserAchievementDto } from './dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from './dto/update-user_achievement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAchievement } from './entities/user_achievement.entity';
import { Repository } from 'typeorm';
import { Achievement } from 'src/achievements/entities/achievement.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class UserAchievementsService {
  constructor(
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
  ) {}

  async create(user_id: number, achievement_id: number): Promise<void> {
    let user = await this.userRepository.findOneBy({ id: user_id });
    let achievement = await this.achievementRepository.findOneBy({
      id: achievement_id,
    });
    let newUserAchievement = this.userAchievementRepository.create({
      user: user,
      achievement: achievement,
    });

    await this.userAchievementRepository.save(newUserAchievement);
  }

  async findAll(): Promise<UserAchievement[]> {
    return await this.userAchievementRepository.find({
      relations: {
        user: true,
        achievement: true,
      },
    });
  }

  async findOne(id: number): Promise<UserAchievement | null> {
    return await this.userAchievementRepository.findOneBy({ id });
  }

  async getAchievedByUser(user_id: number): Promise<UserAchievement[]> {
    return await this.userAchievementRepository.findBy({
      user: { id: user_id },
    });
  }

  async getAchieversByAchievement(
    achievement_id: number,
  ): Promise<UserAchievement[]> {
    return await this.userAchievementRepository.findBy({
      achievement: { id: achievement_id },
    });
  }

  async remove(id: number): Promise<void> {
    await this.userAchievementRepository.delete(id);
  }
}
