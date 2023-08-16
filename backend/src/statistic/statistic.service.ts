import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Statistic } from './entities/statistic.entity';
import { UserService } from 'src/user/user.service';
import { MatchService } from 'src/match/match.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { RemoveStatisticDto } from './dto/remove-statistic.dto';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Statistic)
    private statisticRepository: Repository<Statistic>,

    @Inject(UserService)
    private readonly userService: UserService,

    @Inject(MatchService)
    private readonly matchService: MatchService,
  ) {}

  async create(statisticDto: CreateStatisticDto): Promise<Statistic> {
    const userFound = await this.userService.findOne(
      statisticDto.user_id,
      false,
    );

    return await this.statisticRepository.save({
      wins: 0,
      losses: 0,
      current_winstreak: 0,
      highest_winstreak: 0,
      strength_count: 0,
      speed_count: 0,
      tech_count: 0,
      user: userFound,
    });
  }

  async findAll(): Promise<Statistic[]> {
    return await this.statisticRepository.find();
  }

  async findOne(id: number): Promise<Statistic | null> {
    const found = await this.statisticRepository.findOneBy({
      id,
    });

    if (!found) {
      throw new EntityNotFoundError(Statistic, 'id = ' + id);
    }
    return found;
  }

  async findByUser(user_id: number): Promise<Statistic | null> {
    const found = await this.statisticRepository.findOneBy({
      user: { id: user_id },
    });

    if (!found) {
      throw new EntityNotFoundError(Statistic, 'user_id = ' + user_id);
    }
    return found;
  }

  async update(statisticDto: UpdateStatisticDto): Promise<void> {
    const currentStatistic = await this.findByUser(statisticDto.user_id);
    const newMatch = await this.matchService.findOne(statisticDto.match_id);

    if (newMatch.winner_id === statisticDto.user_id) {
      currentStatistic.wins++;
      currentStatistic.current_winstreak++;
      if (
        currentStatistic.current_winstreak > currentStatistic.highest_winstreak
      ) {
        currentStatistic.highest_winstreak++;
      }
    } else {
      currentStatistic.losses++;
      currentStatistic.current_winstreak = 0;
    }

    const skills = [
      newMatch.skill1_id,
      newMatch.skill2_id,
      newMatch.skill3_id,
      newMatch.skill4_id,
      newMatch.skill5_id,
    ];
    const strength_skills = skills.filter(
      (skill) => skill >= 1 && skill <= 5,
    ).length;
    const speed_skills = skills.filter(
      (skill) => skill >= 6 && skill <= 10,
    ).length;
    const tech_skills = skills.filter(
      (skill) => skill >= 11 && skill <= 15,
    ).length;
    const skill_counts = [strength_skills, speed_skills, tech_skills];
    const top_path = skill_counts.indexOf(Math.max(...skill_counts));

    if (top_path === 0) {
      currentStatistic.strength_count++;
    } else if (top_path === 1) {
      currentStatistic.speed_count++;
    } else {
      currentStatistic.tech_count++;
    }

    await this.statisticRepository.save(currentStatistic);
  }

  async remove(statisticDto: RemoveStatisticDto): Promise<void> {
    await this.statisticRepository.delete(statisticDto.id);
  }
}
