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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid', ParseIntPipe) uid: number): Promise<User | null> {
    return this.usersService.findOne(uid);
  }

  @Patch(':uid')
  update(
    @Param('uid', ParseIntPipe) uid: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return this.usersService.update(uid, updateUserDto);
  }

  @Delete(':uid')
  remove(@Param('uid', ParseIntPipe) uid: number): Promise<void> {
    return this.usersService.remove(uid);
  }
}
