import { Module } from '@nestjs/common';
import { MatchmakingGateway } from './matchmaking.gateway';
@Module({
  providers: [MatchmakingGateway],
})
export class MatchmakingModule {}
