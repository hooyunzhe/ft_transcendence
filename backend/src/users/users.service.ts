import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	findUsers(): Promise<User[]> {
		return this.usersRepository.find();
	}

	findUser(uid: number): Promise<User | null> {
		return this.usersRepository.findOneBy({ uid });
	}

	async createUser(createUserDto: CreateUserDto): Promise<void> {
		await this.usersRepository.save(createUserDto);
	}

	async updateUser(uid: number, updateUserDto: UpdateUserDto): Promise<void> {
		await this.usersRepository.update(uid, updateUserDto);
	}

	async removeUser(uid: number): Promise<void> {
		await this.usersRepository.delete(uid);
	}
}
