import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { User } from 'src/users/entities/user.entity';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { FriendGateway } from './friend.gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User]), UsersModule],
  controllers: [FriendController],
  providers: [FriendService, FriendGateway],
})
export class FriendModule {}
