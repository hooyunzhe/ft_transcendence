import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { User } from 'src/users/entities/user.entity';
import { FriendsGateway } from './friends.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User])],
  controllers: [FriendsController],
  providers: [FriendsService, FriendsGateway],
})
export class FriendsModule {}
