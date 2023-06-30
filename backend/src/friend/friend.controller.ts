import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Friend } from './entities/friend.entity';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import {
  FriendGetQueryParams,
  FriendSearchType,
} from './params/get-query-params';

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  async create(@Body() createFriendDto: CreateFriendDto): Promise<Friend[]> {
    return await this.friendService.create(createFriendDto);
  }

  @Get()
  async find(
    @Query(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
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
    await this.friendService.update(friendDto);
  }

  @Delete()
  async remove(
    @Body('outgoing_id', ParseIntPipe) outgoing_id: number,
    @Body('incoming_id', ParseIntPipe) incoming_id: number,
  ): Promise<void> {
    await this.friendService.deleteRelationship(outgoing_id, incoming_id);
  }
}
