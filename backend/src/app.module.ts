import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { MatchHistoryModule } from './match_history/match_history.module';
import { ChannelsModule } from './channels/channels.module';
import { ChannelUsersModule } from './channel_users/channel_users.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    MatchHistoryModule,
    ChannelsModule,
    ChannelUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
