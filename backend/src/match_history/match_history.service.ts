import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistory } from './entities/match_history.entity';
import { CreateMatchHistoryDto } from './dto/create_match_history.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchHistoryRepository: Repository<MatchHistory>,
  ) {}

  async create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
    await this.matchHistoryRepository.save(createMatchHistoryDto);
  }

  async findAll(): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find();
  }

  async findOne(uid: number): Promise<MatchHistory | null> {
    return await this.matchHistoryRepository.findOneBy({ uid });
  }

  async findAllWithPlayer(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      where: [{ p1_uid: uid }, { p2_uid: uid }],
    });
  }

  async remove(uid: number): Promise<void> {
    await this.matchHistoryRepository.delete(uid);
  }
}
