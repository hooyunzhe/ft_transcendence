import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.usersRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(uid: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ uid });
  }

  async update(uid: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersRepository.update(uid, updateUserDto);
  }

  async remove(uid: number): Promise<void> {
    await this.usersRepository.delete(uid);
  }
}
