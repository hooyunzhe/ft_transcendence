import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	
	@Get()
	getUsers(): Promise<User[]> {
		return this.usersService.findUsers();
	}

	@Get(':uid')
	getOneUser(@Param('uid', ParseIntPipe) uid: number): Promise<User> {
		return this.usersService.findUser(uid);
	}

	@Post()
	createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
		return this.usersService.createUser(createUserDto);
	}

	@Put(':uid')
	updateUser(@Param('uid', ParseIntPipe) uid: number, @Body() updateUserDto: UpdateUserDto): Promise<void> {
		return this.usersService.updateUser(uid, updateUserDto);
	}

	@Delete(':uid')
	removeUser(@Param('uid', ParseIntPipe) uid: number) {
		return this.usersService.removeUser(uid);
	}
}
