import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingService } from './matchmaking.service';

@Module({
	providers: [GameService, GameGateway, MatchmakingGateway, MatchmakingService],
})
export class GameModule {}
