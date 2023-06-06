import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { User } from './entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { Achievement } from 'src/achievements/entities/achievement.entity';

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

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({
      username: ILike(username),
    });
  }

  async getChannels(id: number): Promise<Channel[]> {
    let currentUser = await this.usersRepository.findOne({
      relations: {
        channelMembers: true,
      },
    });

    return currentUser.channelMembers.map(
      (channelMember) => channelMember.channel,
    );
  }

  async findAchieved(id: number): Promise<Achievement[]> {
    let currentUser = await this.usersRepository.findOne({
      relations: {
        userAchievements: true,
      },
      where: { id },
    });

    return currentUser.userAchievements.map(
      (userAchievement) => userAchievement.achievement,
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
