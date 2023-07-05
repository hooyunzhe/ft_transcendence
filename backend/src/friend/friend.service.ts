import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Friend, FriendStatus, FriendAction } from './entities/friend.entity';
import { UserService } from 'src/user/user.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { RemoveFriendDto } from './dto/remove-friend.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,

    @Inject(UserService)
    private readonly usersService: UserService,
  ) {}

  async create(friendDto: CreateFriendDto): Promise<Friend[]> {
    const outgoingFound = await this.usersService.findOne(
      friendDto.outgoing_id,
      false,
    );

    if (!outgoingFound) {
      throw new EntityNotFoundError(
        Friend,
        'outgoing_id: ' + friendDto.outgoing_id,
      );
    }

    const incomingFound = await this.usersService.findOne(
      friendDto.incoming_id,
      false,
    );

    if (!incomingFound) {
      throw new EntityNotFoundError(
        Friend,
        'incoming_id: ' + friendDto.incoming_id,
      );
    }

    const newOutgoingFriendship = this.friendRepository.create({
      outgoing_friend: outgoingFound,
      incoming_friend: incomingFound,
      status: FriendStatus.INVITED,
    });

    const newIncomingFriendship = this.friendRepository.create({
      outgoing_friend: incomingFound,
      incoming_friend: outgoingFound,
      status: FriendStatus.PENDING,
    });

    return await this.friendRepository.save([
      newOutgoingFriendship,
      newIncomingFriendship,
    ]);
  }

  async findAll(): Promise<Friend[]> {
    return await this.friendRepository.find();
  }

  async findOne(id: number): Promise<Friend | null> {
    const found = await this.friendRepository.findOneBy({ id });

    if (!found) {
      throw new EntityNotFoundError(Friend, 'id: ' + id);
    }
    return found;
  }

  async findFriendsOfUser(outgoing_id: number): Promise<Friend[] | null> {
    const outgoingFound = await this.usersService.findOne(outgoing_id, false);

    return await this.friendRepository.findBy({
      outgoing_friend: { id: outgoingFound.id },
    });
  }

  async findExactMatch(
    outgoing_id: number,
    incoming_id: number,
  ): Promise<Friend | null> {
    const outgoingFound = await this.usersService.findOne(outgoing_id, false);
    const incomingFound = await this.usersService.findOne(incoming_id, false);
    const found = await this.friendRepository.findOneBy({
      outgoing_friend: { id: outgoingFound.id },
      incoming_friend: { id: incomingFound.id },
    });

    if (!found) {
      throw new EntityNotFoundError(
        Friend,
        'outgoing_id: ' + outgoing_id + ', incoming_id: ' + incoming_id,
      );
    }
    return found;
  }

  async update(friendDto: UpdateFriendDto): Promise<void> {
    const friendship = await this.findExactMatch(
      friendDto.outgoing_id,
      friendDto.incoming_id,
    );
    if (friendship.status === FriendStatus.PENDING) {
      this.updateFriendRequest(friendDto);
    } else if (
      friendship.status === FriendStatus.FRIENDS &&
      friendDto.action === FriendAction.BLOCK
    ) {
      await this.friendRepository.update(friendship.id, {
        status: FriendStatus.BLOCKED,
      });
    } else if (
      friendship.status === FriendStatus.BLOCKED &&
      friendDto.action === FriendAction.UNBLOCK
    ) {
      await this.friendRepository.update(friendship.id, {
        status: FriendStatus.FRIENDS,
      });
    }
  }

  async updateFriendRequest(friendDto: UpdateFriendDto): Promise<void> {
    if (friendDto.action === FriendAction.ACCEPT) {
      await Promise.all([
        this.friendRepository.update(
          {
            outgoing_friend: { id: friendDto.outgoing_id },
            incoming_friend: { id: friendDto.incoming_id },
          },
          { status: FriendStatus.FRIENDS },
        ),
        this.friendRepository.update(
          {
            outgoing_friend: { id: friendDto.incoming_id },
            incoming_friend: { id: friendDto.outgoing_id },
          },
          { status: FriendStatus.FRIENDS },
        ),
      ]);
    } else if (friendDto.action === FriendAction.REJECT)
      await this.remove(friendDto);
  }

  async remove(friendDto: RemoveFriendDto): Promise<void> {
    await Promise.all([
      this.friendRepository.delete({
        outgoing_friend: { id: friendDto.outgoing_id },
        incoming_friend: { id: friendDto.incoming_id },
      }),
      this.friendRepository.delete({
        outgoing_friend: { id: friendDto.incoming_id },
        incoming_friend: { id: friendDto.outgoing_id },
      }),
    ]);
  }
}
