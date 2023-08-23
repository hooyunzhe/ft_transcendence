import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { Match } from 'src/match/entities/match.entity';
import { Message } from 'src/message/entities/message.entity';
import { Statistic } from 'src/statistic/entities/statistic.entity';
import { TwoFactor } from 'src/two-factor/entities/two-factor.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { UserGetQueryParams, UserSearchType } from './params/get-query-params';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.userService.create(userDto);
  }

  @Get()
  async find(
    @Query()
    queryParams: UserGetQueryParams,
  ): Promise<
    | Achievement[]
    | Channel[]
    | Match[]
    | Message[]
    | Statistic
    | TwoFactor
    | User[]
    | User
    | null
  > {
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
      case UserSearchType.RELATION:
        return this.userService.getRelations(
          queryParams.search_number,
          queryParams.search_relation,
        );
    }
  }

  @Patch()
  async update(@Body() userDto: UpdateUserDto): Promise<void> {
    return this.userService.update(userDto);
  }

  @Delete()
  async remove(@Body() userDto: RemoveUserDto): Promise<void> {
    return this.userService.remove(userDto);
  }
}
