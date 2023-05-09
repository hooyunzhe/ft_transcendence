import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistoryService } from './match_history.service';
import { MatchHistoryController } from './match_history.controller';
import { MatchHistory } from './entities/match_history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchHistory])],
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService]
})
export class MatchHistoryModule {}
