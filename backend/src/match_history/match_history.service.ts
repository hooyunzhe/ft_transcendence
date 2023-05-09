import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistory } from './entities/match_history.entity';
import { CreateMatchHistoryDto } from './dto/create-match_history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match_history.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchHistoryRepository: Repository<MatchHistory>
  ) {}

  async findAllMatch(): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find();
  }

  async findOneMatch(uid: number): Promise<MatchHistory | null> {
    return await this.matchHistoryRepository.findOneBy({uid});
  }

  async findPlayerMatch(uid: number): Promise<MatchHistory[] | null> {
    const matches = await this.matchHistoryRepository.find({
      where: [
        { p1_uid: uid },
        { p2_uid: uid },
      ]
    });
    return await matches;
  }
  async createMatchHistory(createMatchHistoryDto: CreateMatchHistoryDto) {
    await this.matchHistoryRepository.save(createMatchHistoryDto);
  }
  async updateMatchHistory(uid: number, updateMatchHistoryDto: UpdateMatchHistoryDto): Promise<void> {
    await this.matchHistoryRepository.update(uid, updateMatchHistoryDto);
  }

	async removeMatchHistory(uid: number): Promise<void> {
		await this.matchHistoryRepository.delete(uid);
	}
}
