import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Preference } from 'src/preference/entities/preference.entity';
import { TwoFactor } from 'src/two-factor/entities/two-factor.entity';
import { Statistic } from 'src/statistic/entities/statistic.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { Message } from 'src/message/entities/message.entity';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { FriendStatus } from 'src/friend/entities/friend.entity';
import { Match } from 'src/match/entities/match.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { UserRelation } from './params/get-query-params';
import { EntityAlreadyExistsError } from 'src/app.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getRelationsToLoad(loadRelations: boolean): {
    preference: boolean;
    twoFactor: boolean;
    statistic: boolean;
    channelMembers: boolean;
    messages: boolean;
    userAchievements: boolean;
    outgoingFriendships: boolean;
    matchesAsPlayerOne: boolean;
    matchesAsPlayerTwo: boolean;
  } {
    return {
      preference: loadRelations,
      twoFactor: loadRelations,
      statistic: loadRelations,
      channelMembers: loadRelations,
      messages: loadRelations,
      userAchievements: loadRelations,
      outgoingFriendships: loadRelations,
      matchesAsPlayerOne: loadRelations,
      matchesAsPlayerTwo: loadRelations,
    };
  }

  async setTwoFactorEnabled(id: number, enabled: boolean): Promise<void> {
    await this.userRepository.update(id, { two_factor_enabled: enabled });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const usernameExists = await this.userRepository.findOneBy({
      username: userDto.username,
    });
    const intraIDExists = await this.userRepository.findOneBy({
      intra_id: userDto.intra_id,
    });

    if (usernameExists) {
      throw new EntityAlreadyExistsError(
        'User',
        'username = ' + userDto.username,
      );
    }
    if (intraIDExists) {
      throw new EntityAlreadyExistsError(
        'User',
        'intra_id = ' + userDto.intra_id,
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

  async findByIntraID(
    intraID: string,
    loadRelations: boolean,
  ): Promise<User | null> {
    const found = await this.userRepository.findOne({
      relations: this.getRelationsToLoad(loadRelations),
      where: { intra_id: intraID },
    });

    if (!found) {
      throw new EntityNotFoundError(User, 'intra_id = ' + intraID);
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
    refreshToken: string,
    loadRelations: boolean,
  ): Promise<User | null> {
    const found = await this.userRepository.findOne({
      relations: this.getRelationsToLoad(loadRelations),
      where: { refresh_token: refreshToken },
    });

    if (!found) {
      throw new EntityNotFoundError(User, 'refresh_token = ' + refreshToken);
    }
    return found;
  }

  async getRelations(
    id: number,
    relation: UserRelation,
  ): Promise<
    | Preference
    | TwoFactor
    | Statistic
    | Channel[]
    | Message[]
    | Achievement[]
    | User[]
    | Match[]
  > {
    switch (relation) {
      case UserRelation.PREFERENCE:
        return this.getPreference(id);
      case UserRelation.TWO_FACTOR:
        return this.getTwoFactor(id);
      case UserRelation.STATISTIC:
        return this.getStatistic(id);
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

  async getPreference(id: number): Promise<Preference> {
    const currentUser = await this.findOne(id, true);

    return currentUser.preference;
  }

  async getTwoFactor(id: number): Promise<TwoFactor> {
    const currentUser = await this.findOne(id, true);

    return currentUser.twoFactor;
  }

  async getStatistic(id: number): Promise<Statistic> {
    const currentUser = await this.findOne(id, true);

    return currentUser.statistic;
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
    if (userDto.intra_id) {
      const userExists = await this.userRepository.findOneBy({
        intra_id: userDto.intra_id,
      });

      if (userExists) {
        throw new EntityAlreadyExistsError(
          'User',
          'intra_id = ' + userDto.intra_id,
        );
      }
    }

    if (userDto.username) {
      const userExists = await this.userRepository.findOneBy({
        username: userDto.username,
      });

      if (userExists) {
        throw new EntityAlreadyExistsError(
          'User',
          'username = ' + userDto.username,
        );
      }
    }

    await this.userRepository.update(userDto.id, {
      ...(userDto.intra_id && { intra_id: userDto.intra_id }),
      ...(userDto.username && { username: userDto.username }),
      ...(userDto.refresh_token && { refresh_token: userDto.refresh_token }),
      ...(userDto.avatar_url && { avatar_url: userDto.avatar_url }),
    });
  }

  async remove(userDto: RemoveUserDto): Promise<void> {
    await this.userRepository.delete(userDto.id);
  }
}
