import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend } from './entities/friend.entity';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) { }

  @Post()
  async create(@Body('user1_id', ParseIntPipe) user1_id: number,
    @Body('user2_id', ParseIntPipe) user2_id: number): Promise<void> {
    // console.log(senderFriendDto);
    // console.log(receiverFriendDto);
    await this.friendsService.create(user1_id, user2_id);
  }



  @Get('user')
  async findUserFriend(
    @Body('user1_id', ParseIntPipe) user1_id: number,
    @Body('user2_id', new DefaultValuePipe(0), ParseIntPipe) user2_id: number): Promise<Friend[] | Friend | null> {
    if (user2_id === 0)
      return await this.friendsService.findAllUserFriend(user1_id);
    else
      return await this.friendsService.findExactMatch(user1_id, user2_id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Friend | null> {
    return this.friendsService.findOne(id);
  }

  @Get()
  findAll(): Promise<Friend[]> {
    return this.friendsService.findAll();
  }

  @Patch()
  async update(@Body() friendDto: CreateFriendDto): Promise<void> {
    await this.friendsService.update(friendDto);
  }

  @Delete()
  async remove(@Body('user1_id', ParseIntPipe) user1_id: number,
    @Body('user2_id', ParseIntPipe) user2_id: number): Promise<void> {
    await this.friendsService.deleteRelationship(user1_id, user2_id);
  }
}
