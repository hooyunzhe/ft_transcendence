import { Module } from '@nestjs/common';
import { GameClass } from './game.class';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { MatchModule } from 'src/match/match.module';

@Module({
  imports: [MatchModule],
  providers: [GameService, GameClass, GameGateway],
})
export class GameModule {}
