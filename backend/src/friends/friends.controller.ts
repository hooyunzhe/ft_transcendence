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
  async create(@Query('uid_1', ParseIntPipe) uid_1: number,
    @Query('uid_2', ParseIntPipe) uid_2: number): Promise<void> {
    // console.log(senderFriendDto);
    // console.log(receiverFriendDto);
    await this.friendsService.create(uid_1, uid_2);
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

  @Patch()
  async update(@Body() friendDto: CreateFriendDto): Promise<void> {
    await this.friendsService.update(friendDto);
  }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.friendsService.remove(id);
  // }

  @Delete()
  async remove(@Query('uid_1', ParseIntPipe) uid_1: number,
    @Query('uid_2', ParseIntPipe) uid_2: number): Promise<void> {
    await this.friendsService.deleteRelationship(uid_1, uid_2);
  }
}
