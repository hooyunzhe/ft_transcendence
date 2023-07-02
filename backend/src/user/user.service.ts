import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Achievement } from 'src/achievements/entities/achievement.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async findAll(load_relations: boolean): Promise<User[]> {
    if (load_relations) {
      return await this.userRepository.find({
        relations: {
          channelMembers: true,
          userAchievements: true,
          outgoingFriendships: true,
        },
      });
    } else {
      return await this.userRepository.find();
    }
  }

  async findOne(id: number, load_relations: boolean): Promise<User | null> {
    if (load_relations) {
      return await this.userRepository.findOne({
        where: { id },
        relations: {
          channelMembers: true,
          userAchievements: true,
          outgoingFriendships: true,
        },
      });
    } else {
      return await this.userRepository.findOneBy({ id });
    }
  }

  async findByUsername(
    username: string,
    load_relations: boolean,
  ): Promise<User | null> {
    if (load_relations) {
      return await this.userRepository.findOne({
        where: { username: ILike(username) },
        relations: {
          channelMembers: true,
          userAchievements: true,
          outgoingFriendships: true,
        },
      });
    } else {
      return await this.userRepository.findOneBy({
        username: ILike(username),
      });
    }
  }

  async findByToken(
    refresh_token: string,
    load_relations: boolean,
  ): Promise<User | null> {
    if (load_relations) {
      return await this.userRepository.findOne({
        where: { refresh_token },
        relations: {
          channelMembers: true,
          userAchievements: true,
          outgoingFriendships: true,
        },
      });
    } else {
      return await this.userRepository.findOneBy({
        refresh_token,
      });
    }
  }

  async getChannels(id: number): Promise<Channel[]> {
    let currentUser = await this.userRepository.findOne({
      relations: {
        channelMembers: true,
      },
      where: { id },
    });

    return currentUser.channelMembers.map(
      (channelMember) => channelMember.channel,
    );
  }

  async findAchieved(id: number): Promise<Achievement[]> {
    let currentUser = await this.userRepository.findOne({
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
    await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
