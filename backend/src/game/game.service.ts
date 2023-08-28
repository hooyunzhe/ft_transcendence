import { Inject, Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { MatchService } from "src/match/match.service";
import { GameClass } from "./game.class";
import { CreateMatchDto } from "src/match/dto/create-match.dto";


export interface MatchInfo {
  roomid: string,
  player1: number,
  player2: number,
}
@Injectable()
export class GameService {
  constructor(
    @Inject(MatchService)
    private readonly matchService: MatchService,
  ) {}

  createGame(matchinfo: MatchInfo, socketHandler: (roomid: string, message: string, data: any) => void){
    const newGame = new GameClass(matchinfo, socketHandler, this.matchHandler);
    return newGame;
  }
  matchHandler = (matchDto: CreateMatchDto) => { 
    this.matchService.create(matchDto);

  } 


}