import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserService } from 'src/user/user.service';
import { AchievementService } from 'src/achievement/achievement.service';
import { CreateUserAchievementDto } from './dto/create-user-achievement.dto';
import { RemoveUserAchievementDto } from './dto/remove-user-achievement.dto';

@Injectable()
export class UserAchievementService {
  constructor(
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,

    @Inject(UserService)
    private readonly userService: UserService,

    @Inject(AchievementService)
    private readonly achievementService: AchievementService,
  ) {}

  async create(
    userAchievementDto: CreateUserAchievementDto,
  ): Promise<UserAchievement> {
    const userFound = await this.userService.findOne(
      userAchievementDto.user_id,
      false,
    );
    const achievementFound = await this.achievementService.findOne(
      userAchievementDto.achievement_id,
      false,
    );

    const newUserAchievement = this.userAchievementRepository.create({
      user: userFound,
      achievement: achievementFound,
    });

    return await this.userAchievementRepository.save(newUserAchievement);
  }

  async findAll(): Promise<UserAchievement[]> {
    return await this.userAchievementRepository.find();
  }

  async findOne(id: number): Promise<UserAchievement | null> {
    const found = await this.userAchievementRepository.findOneBy({ id });

    if (!found) {
      throw new EntityNotFoundError(UserAchievement, 'id: ' + id);
    }
    return found;
  }

  async findAchievedByUser(user_id: number): Promise<UserAchievement[]> {
    const userFound = await this.userService.findOne(user_id, false);

    return await this.userAchievementRepository.findBy({
      user: { id: userFound.id },
    });
  }

  async findAchieversByAchievement(
    achievement_id: number,
  ): Promise<UserAchievement[]> {
    const achievementFound = await this.achievementService.findOne(
      achievement_id,
      false,
    );

    return await this.userAchievementRepository.findBy({
      achievement: achievementFound,
    });
  }

  async findExact(
    user_id: number,
    achievement_id: number,
  ): Promise<UserAchievement> {
    const userFound = await this.userService.findOne(user_id, false);
    const achievementFound = await this.achievementService.findOne(
      achievement_id,
      false,
    );
    const found = await this.userAchievementRepository.findOneBy({
      user: { id: userFound.id },
      achievement: { id: achievementFound.id },
    });

    if (!found) {
      throw new EntityNotFoundError(
        UserAchievement,
        'user_id: ' + user_id + ', achievement_id: ' + achievement_id,
      );
    }
    return found;
  }

  async remove(userAchievementDto: RemoveUserAchievementDto): Promise<void> {
    await this.userAchievementRepository.delete(userAchievementDto.id);
  }
}
