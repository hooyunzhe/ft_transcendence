import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/friends/entities/friend.entity';
import { MatchHistory } from 'src/match_history/entities/match_history.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'ft_transcendence',
      entities: [User, Friend, MatchHistory],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
