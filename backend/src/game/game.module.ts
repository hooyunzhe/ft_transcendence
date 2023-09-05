import { Module } from '@nestjs/common';
import { GameClass } from './game.class';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { MatchModule } from 'src/match/match.module';
import { StatisticModule } from 'src/statistic/statistic.module';

@Module({
  imports: [MatchModule, StatisticModule],
  providers: [GameService, GameClass, GameGateway],
})
export class GameModule {}
