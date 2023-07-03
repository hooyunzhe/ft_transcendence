import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { Friend } from './entities/friend.entity';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { RemoveFriendDto } from './dto/remove-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import {
  FriendGetQueryParams,
  FriendSearchType,
} from './params/get-query-params';

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  async create(@Body() friendDto: CreateFriendDto): Promise<Friend[]> {
    return this.friendService.create(friendDto);
  }

  @Get()
  async find(
    @Query()
    queryParams: FriendGetQueryParams,
  ): Promise<Friend[] | Friend | null> {
    switch (queryParams.search_type) {
      case FriendSearchType.ALL:
        return this.friendService.findAll();
      case FriendSearchType.ONE:
        return this.friendService.findOne(queryParams.search_number);
      case FriendSearchType.USER:
        return this.friendService.findFriendsOfUser(queryParams.search_number);
      case FriendSearchType.EXACT:
        return this.friendService.findExactMatch(
          queryParams.search_number,
          queryParams.second_search_number,
        );
    }
  }

  @Patch()
  async update(@Body() friendDto: UpdateFriendDto): Promise<void> {
    this.friendService.update(friendDto);
  }

  @Delete()
  async remove(@Body() friendDto: RemoveFriendDto): Promise<void> {
    this.friendService.remove(friendDto);
  }
}
