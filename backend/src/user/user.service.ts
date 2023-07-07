import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { FriendStatus } from 'src/friend/entities/friend.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { UserRelation } from './params/get-query-params';
import { Message } from 'src/message/entities/message.entity';
import { Match } from 'src/match/entities/match.entity';
import { EntityAlreadyExistsError } from 'src/app.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getRelationsToLoad(loadRelations: boolean): {
    channelMembers: boolean;
    messages: boolean;
    userAchievements: boolean;
    outgoingFriendships: boolean;
    matchesAsPlayerOne: boolean;
    matchesAsPlayerTwo: boolean;
  } {
    return {
      channelMembers: loadRelations,
      messages: loadRelations,
      userAchievements: loadRelations,
      outgoingFriendships: loadRelations,
      matchesAsPlayerOne: loadRelations,
      matchesAsPlayerTwo: loadRelations,
    };
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.findOneBy({
      username: userDto.username,
    });

    if (userExists) {
      throw new EntityAlreadyExistsError(
        'User',
        'username = ' + userDto.username,
      );
    }
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
      throw new EntityNotFoundError(User, 'id = ' + id);
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
      throw new EntityNotFoundError(User, 'username = ' + username);
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
      throw new EntityNotFoundError(User, 'refresh_token = ' + refresh_token);
    }
    return found;
  }

  async getRelations(
    id: number,
    relation: UserRelation,
  ): Promise<Channel[] | Message[] | Achievement[] | User[] | Match[]> {
    switch (relation) {
      case UserRelation.CHANNELS:
        return this.getChannels(id);
      case UserRelation.MESSAGES:
        return this.getMessages(id);
      case UserRelation.ACHIEVEMENTS:
        return this.getAchievements(id);
      case UserRelation.FRIENDS:
        return this.getFriends(id);
      case UserRelation.MATCHES:
        return this.getMatches(id);
    }
  }

  async getChannels(id: number): Promise<Channel[]> {
    const currentUser = await this.findOne(id, true);

    return currentUser.channelMembers.map(
      (channelMember) => channelMember.channel,
    );
  }

  async getMessages(id: number): Promise<Message[]> {
    const currentUser = await this.findOne(id, true);

    return currentUser.messages;
  }

  async getAchievements(id: number): Promise<Achievement[]> {
    const currentUser = await this.findOne(id, true);

    return currentUser.userAchievements.map(
      (userAchievement) => userAchievement.achievement,
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

  async getMatches(id: number): Promise<Match[]> {
    const currentUser = await this.findOne(id, true);

    return [
      ...currentUser.matchesAsPlayerOne,
      ...currentUser.matchesAsPlayerTwo,
    ];
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
