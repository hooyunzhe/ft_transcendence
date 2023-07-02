import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Channel } from 'src/channels/entities/channel.entity';
import { Achievement } from 'src/achievements/entities/achievement.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGetQueryParams, UserSearchType } from './params/get-query-params';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async find(
    @Query()
    queryParams: UserGetQueryParams,
  ): Promise<User[] | User | null> {
    queryParams.load_relations ??= false;
    switch (queryParams.search_type) {
      case UserSearchType.ALL:
        return this.userService.findAll(queryParams.load_relations);
      case UserSearchType.ONE:
        return this.userService.findOne(
          queryParams.search_number,
          queryParams.load_relations,
        );
      case UserSearchType.NAME:
        return this.userService.findByUsername(
          queryParams.search_string,
          queryParams.load_relations,
        );
      case UserSearchType.TOKEN:
        return this.userService.findByToken(
          queryParams.search_string,
          queryParams.load_relations,
        );
    }
  }

  @Get(':id/channels')
  getChannels(@Param('id', ParseIntPipe) id: number): Promise<Channel[]> {
    return this.userService.getChannels(id);
  }

  @Get(':id/achieved')
  findAchieved(@Param('id') id: number): Promise<Achievement[]> {
    return this.userService.findAchieved(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
