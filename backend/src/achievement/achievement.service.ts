import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { RemoveAchievementDto } from './dto/remove-achievement.dto';
import { AchievementRelation } from './params/get-query-params';
import { EntityAlreadyExistsError } from 'src/app.error';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
  ) {}

  getRelationsToLoad(loadRelations: boolean): { userAchievements: boolean } {
    return { userAchievements: loadRelations };
  }

  async create(achievementDto: CreateAchievementDto): Promise<Achievement> {
    const achievementExists = await this.achievementRepository.findOneBy({
      name: achievementDto.name,
    });

    if (achievementExists) {
      throw new EntityAlreadyExistsError(
        'Achievement',
        'name = ' + achievementDto.name,
      );
    }

    return await this.achievementRepository.save(achievementDto);
  }

  async findAll(loadRelations: boolean): Promise<Achievement[]> {
    return await this.achievementRepository.find({
      relations: this.getRelationsToLoad(loadRelations),
    });
  }

  async findOne(
    id: number,
    loadRelations: boolean,
  ): Promise<Achievement | null> {
    const found = await this.achievementRepository.findOne({
      relations: this.getRelationsToLoad(loadRelations),
      where: { id },
    });

    if (!found) {
      throw new EntityNotFoundError(Achievement, 'id = ' + id);
    }
    return found;
  }

  async findByName(
    name: string,
    loadRelations: boolean,
  ): Promise<Achievement | null> {
    const found = await this.achievementRepository.findOne({
      relations: this.getRelationsToLoad(loadRelations),
      where: { name },
    });

    if (!found) {
      throw new EntityNotFoundError(Achievement, 'name = ' + name);
    }
    return found;
  }

  async getRelations(
    id: number,
    relation: AchievementRelation,
  ): Promise<User[]> {
    switch (relation) {
      case AchievementRelation.ACHIEVERS:
        return this.getAchievers(id);
    }
  }

  async getAchievers(id: number): Promise<User[]> {
    const currentAchievement = await this.findOne(id, true);

    return currentAchievement.userAchievements.map(
      (UserAchievement) => UserAchievement.user,
    );
  }

  async update(achievementDto: UpdateAchievementDto): Promise<void> {
    await this.achievementRepository.update(achievementDto.id, {
      ...(achievementDto.name && { name: achievementDto.name }),
      ...(achievementDto.description && {
        description: achievementDto.description,
      }),
    });
  }

  async remove(achievementDto: RemoveAchievementDto): Promise<void> {
    await this.achievementRepository.delete(achievementDto.id);
  }
}
