import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Channel } from 'src/channels/entities/channel.entity';
import { Achievement } from 'src/achievements/entities/achievement.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // #Get()
  // async find(@Param())

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('username/:username')
  findByUsername(@Param('username') username: string): Promise<User | null> {
    return this.userService.findByUsername(username);
  }

  @Get('token/:refresh_token')
  findByToken(
    @Param('refresh_token') refresh_token: string,
  ): Promise<User | null> {
    return this.userService.findByToken(refresh_token);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.findOne(id);
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
