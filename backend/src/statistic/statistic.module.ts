import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistic } from './entities/statistic.entity';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { UserModule } from 'src/user/user.module';
import { MatchModule } from 'src/match/match.module';

@Module({
  imports: [TypeOrmModule.forFeature([Statistic]), UserModule, MatchModule],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
