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
import { get } from 'http';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) { }

  @Post()
  async create(
    @Body('sender') senderFriendDto: CreateFriendDto,
    @Body('receiver') receiverFriendDto: CreateFriendDto,
  ): Promise<void> {
    // console.log(senderFriendDto);
    // console.log(receiverFriendDto);
    Promise.all([
      this.friendsService.create(senderFriendDto),
      this.friendsService.create(receiverFriendDto),
    ]);
  }



  @Get('user')
  async findUserFriend(
    @Query('uid_1', ParseIntPipe) uid_1: number,
    @Query('uid_2', new DefaultValuePipe(0), ParseIntPipe) uid_2: number): Promise<Friend[] | Friend | null> {
    if (uid_2 === 0)
      return await this.friendsService.findAllUserFriend(uid_1);
    else
      return await this.friendsService.findExactMatch(uid_1, uid_2);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // console.log("here2");
    return this.friendsService.findOne(id);
  }

  @Get()
  findAll() {
    // console.log("here3");
    return this.friendsService.findAll();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.update(id, updateFriendDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.friendsService.remove(id);
  }

  @Delete()
  async removeRelationship(@Body('sender') senderFriendDto: CreateFriendDto,
    @Body('receiver') receiverFriendDto: CreateFriendDto,
  ): Promise<void> {
    Promise.all([
      this.friendsService.deleteExactMatch(senderFriendDto.p1_uid, senderFriendDto.p2_uid),
      this.friendsService.deleteExactMatch(receiverFriendDto.p1_uid, receiverFriendDto.p2_uid),
    ])
  }
}
