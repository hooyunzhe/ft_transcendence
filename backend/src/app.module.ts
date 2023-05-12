import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { MatchHistoryModule } from './match_history/match_history.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [DatabaseModule, UsersModule, MatchHistoryModule, ChannelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
