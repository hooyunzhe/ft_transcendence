import { Inject, Injectable } from '@nestjs/common';
import { GameClass } from './game.class';
import { MatchService } from 'src/match/match.service';
import { CreateMatchDto } from 'src/match/dto/create-match.dto';
import { StatisticService } from 'src/statistic/statistic.service';

export interface MatchInfo {
  roomid: string;
  player1: number;
  player2: number;
}
@Injectable()
export class GameService {
  constructor(
    @Inject(MatchService)
    private readonly matchService: MatchService,

    @Inject(StatisticService)
    private readonly statisticService: StatisticService,
  ) {}

  roomlist = new Map<string, GameClass>();

  createGame(
    matchinfo: MatchInfo,
    socketHandler: (roomid: string, message: string, data: any) => void,
  ) {
    this.roomlist.set(
      matchinfo.roomid,
      new GameClass(matchinfo, socketHandler, this.matchHandler),
    );
  }

  deleteGame(roomid: string) {
    this.roomlist.delete(roomid);
  }

  matchHandler = async (matchDto: CreateMatchDto) => {
    const newMatch = await this.matchService.create(matchDto);
    this.statisticService.update({
      user_id: newMatch.player_one.id,
      match_id: newMatch.id,
    });
    this.statisticService.update({
      user_id: newMatch.player_two.id,
      match_id: newMatch.id,
    });
  };
}
