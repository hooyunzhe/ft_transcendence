import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { FriendGateway } from './friend.gateway';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User]), UserModule],
  controllers: [FriendController],
  providers: [FriendService, FriendGateway],
})
export class FriendModule {}
