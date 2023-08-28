import { Module } from '@nestjs/common';
import { GameClass } from './game.class';
import { GameGateway } from './game.gateway';
import { MatchModule } from 'src/match/match.module';
import { GameService } from './game.service';

@Module({
  imports: [MatchModule],
  providers: [GameService, GameClass, GameGateway],
})
export class GameModule {}
