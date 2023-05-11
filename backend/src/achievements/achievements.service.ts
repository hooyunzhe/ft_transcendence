import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';
// import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement } from './entities/achievement.entity';

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

  async remove(id: number): Promise<void> {
    await this.achievementRepository.delete(id);
  }
}
