import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { RemoveMatchDto } from './dto/remove.match.dto';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async create(matchDto: CreateMatchDto): Promise<Match> {
    const playerOneFound = await this.userService.findOne(
      matchDto.p1_id,
      false,
    );
    const playerTwoFound = await this.userService.findOne(
      matchDto.p2_id,
      false,
    );

    if (
      matchDto.winner_id !== playerOneFound.id &&
      matchDto.winner_id !== playerTwoFound.id
    ) {
      throw new EntityNotFoundError(User, 'winner_id = ' + matchDto.winner_id);
    }

    return await this.matchRepository.save({
      winner_id: matchDto.winner_id,
      p1_score: matchDto.p1_score,
      p2_score: matchDto.p2_score,
      p1_skills: matchDto.p1_skills,
      p2_skills: matchDto.p2_skills,
      player_one: playerOneFound,
      player_two: playerTwoFound,
    });
  }

  async findAll(): Promise<Match[]> {
    return await this.matchRepository.find();
  }

  async findOne(id: number): Promise<Match | null> {
    const found = await this.matchRepository.findOneBy({ id });

    if (!found) {
      throw new EntityNotFoundError(Match, 'id = ' + id);
    }
    return found;
  }

  async findAllWithPlayer(player_id: number): Promise<Match[]> {
    const playerFound = await this.userService.findOne(player_id, false);

    return await this.matchRepository.find({
      where: [
        { player_one: { id: playerFound.id } },
        { player_two: { id: playerFound.id } },
      ],
    });
  }

  async findAllWithWinner(player_id: number): Promise<Match[]> {
    const playerFound = await this.userService.findOne(player_id, false);

    return await this.matchRepository.find({
      where: { winner_id: playerFound.id },
    });
  }

  async findAllWithBothPlayers(p1_id: number, p2_id: number): Promise<Match[]> {
    const playerOneFound = await this.userService.findOne(p1_id, false);
    const playerTwoFound = await this.userService.findOne(p2_id, false);

    return await this.matchRepository.find({
      where: {
        player_one: { id: playerOneFound.id },
        player_two: { id: playerTwoFound.id },
      },
    });
  }

  async remove(matchDto: RemoveMatchDto): Promise<void> {
    await this.matchRepository.delete(matchDto.id);
  }
}
