import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Statistic } from './entities/statistic.entity';
import { UserService } from 'src/user/user.service';
import { MatchService } from 'src/match/match.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { RemoveStatisticDto } from './dto/remove-statistic.dto';
import { EntityAlreadyExistsError } from 'src/app.error';

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
    const statisticFound = await this.statisticRepository.findOneBy({
      user: { id: userFound.id },
    });

    if (statisticFound) {
      throw new EntityAlreadyExistsError(
        'Statistic',
        'user_id = ' + userFound.id,
      );
    }
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

  async findByUser(userID: number): Promise<Statistic | null> {
    const userFound = await this.userService.findOne(userID, false);
    const found = await this.statisticRepository.findOneBy({
      user: { id: userFound.id },
    });

    if (!found) {
      throw new EntityNotFoundError(Statistic, 'user_id = ' + userID);
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

    const classID =
      newMatch.player_one.id === statisticDto.user_id
        ? newMatch.p1_class_id
        : newMatch.p2_class_id;

    if (classID === 1) {
      currentStatistic.strength_count++;
    } else if (classID === 2) {
      currentStatistic.speed_count++;
    } else if (classID === 3) {
      currentStatistic.tech_count++;
    }

    await this.statisticRepository.save(currentStatistic);
  }

  async remove(statisticDto: RemoveStatisticDto): Promise<void> {
    await this.statisticRepository.delete(statisticDto.id);
  }
}
