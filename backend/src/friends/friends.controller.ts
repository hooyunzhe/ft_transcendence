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
import { Friend } from './entities/friend.entity';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  async create(@Body() createFriendDto: CreateFriendDto): Promise<void> {
    await this.friendsService.create(createFriendDto);
  }

  @Get('user')
  async findFriendships(
    @Query('user1_id', ParseIntPipe) user1_id: number,
    @Query('user2_id', new DefaultValuePipe(0), ParseIntPipe) user2_id: number,
  ): Promise<Friend[] | Friend | null> {
    return this.friendsService.findFriendships(user1_id, user2_id);
  }

  @Get()
  findAll(): Promise<Friend[]> {
    return this.friendsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Friend | null> {
    return this.friendsService.findOne(id);
  }

  @Patch()
  async update(@Body() friendDto: CreateFriendDto): Promise<void> {
    await this.friendsService.update(friendDto);
  }

  @Delete()
  async remove(
    @Body('user1_id', ParseIntPipe) user1_id: number,
    @Body('user2_id', ParseIntPipe) user2_id: number,
  ): Promise<void> {
    await this.friendsService.deleteRelationship(user1_id, user2_id);
  }
}
