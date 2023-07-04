import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Achievement } from 'src/achievements/entities/achievement.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { FriendStatus } from 'src/friend/entities/friend.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { UserRelation } from './params/get-query-params';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getRelationsToLoad(loadRelations: boolean): {
    channelMembers: boolean;
    userAchievements: boolean;
    outgoingFriendships: boolean;
  } {
    return {
      channelMembers: loadRelations,
      userAchievements: loadRelations,
      outgoingFriendships: loadRelations,
    };
  }

  async create(userDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(userDto);
  }

  async findAll(loadRelations: boolean): Promise<User[]> {
    return await this.userRepository.find({
      relations: this.getRelationsToLoad(loadRelations),
    });
  }

  async findOne(id: number, loadRelations: boolean): Promise<User | null> {
    const found = await this.userRepository.findOne({
      relations: this.getRelationsToLoad(loadRelations),
      where: { id },
    });

    if (!found) {
      throw new EntityNotFoundError(User, 'id: ' + id);
    }
    return found;
  }

  async findByUsername(
    username: string,
    loadRelations: boolean,
  ): Promise<User | null> {
    const found = await this.userRepository.findOne({
      relations: this.getRelationsToLoad(loadRelations),
      where: { username: ILike(username) },
    });

    if (!found) {
      throw new EntityNotFoundError(User, 'username: ' + username);
    }
    return found;
  }

  async findByToken(
    refresh_token: string,
    loadRelations: boolean,
  ): Promise<User | null> {
    const found = await this.userRepository.findOne({
      relations: this.getRelationsToLoad(loadRelations),
      where: { refresh_token },
    });

    if (!found) {
      throw new EntityNotFoundError(User, 'refresh_token: ' + refresh_token);
    }
    return found;
  }

  async getRelations(
    id: number,
    relation: UserRelation,
  ): Promise<Achievement[] | Channel[] | User[]> {
    switch (relation) {
      case UserRelation.ACHIEVEMENTS:
        return this.getAchievements(id);
      case UserRelation.CHANNELS:
        return this.getChannels(id);
      case UserRelation.FRIENDS:
        return this.getFriends(id);
    }
  }

  async getAchievements(id: number): Promise<Achievement[]> {
    const currentUser = await this.findOne(id, true);

    return currentUser.userAchievements.map(
      (userAchievement) => userAchievement.achievement,
    );
  }

  async getChannels(id: number): Promise<Channel[]> {
    const currentUser = await this.findOne(id, true);

    return currentUser.channelMembers.map(
      (channelMember) => channelMember.channel,
    );
  }

  async getFriends(id: number): Promise<User[]> {
    const currentUser = await this.findOne(id, true);

    return currentUser.outgoingFriendships
      .filter(
        (outgoingFriendship) =>
          outgoingFriendship.status === FriendStatus.FRIENDS,
      )
      .map((outgoingFriendship) => outgoingFriendship.incoming_friend);
  }

  async update(userDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(userDto.id, {
      ...(userDto.username && { username: userDto.username }),
      ...(userDto.refresh_token && { refresh_token: userDto.refresh_token }),
    });
  }

  async remove(userDto: RemoveUserDto): Promise<void> {
    await this.userRepository.delete(userDto.id);
  }
}
