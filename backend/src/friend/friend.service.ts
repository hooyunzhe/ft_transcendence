import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Friend, FriendStatus, FriendAction } from './entities/friend.entity';
import { UserService } from 'src/user/user.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,

    @Inject(UserService)
    private readonly usersService: UserService,
  ) {}

  async create(createFriendDto: CreateFriendDto): Promise<Friend[]> {
    const outgoingFound = await this.usersService.findOne(
      createFriendDto.outgoing_id,
      false,
    );

    if (!outgoingFound) {
      throw new EntityNotFoundError(
        Friend,
        'outgoing_id: ' + createFriendDto.outgoing_id,
      );
    }

    const incomingFound = await this.usersService.findOne(
      createFriendDto.incoming_id,
      false,
    );

    if (!incomingFound) {
      throw new EntityNotFoundError(
        Friend,
        'incoming_id: ' + createFriendDto.incoming_id,
      );
    }

    const newOutgoingFriendship = this.friendRepository.create({
      outgoing_friend: {
        id: createFriendDto.outgoing_id,
      },
      incoming_friend: {
        id: createFriendDto.incoming_id,
      },
      status: FriendStatus.Invited,
    });

    const newIncomingFriendship = this.friendRepository.create({
      outgoing_friend: {
        id: createFriendDto.incoming_id,
      },
      incoming_friend: {
        id: createFriendDto.outgoing_id,
      },
      status: FriendStatus.Pending,
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
    return await this.friendRepository.findBy({
      outgoing_friend: { id: outgoing_id },
    });
  }

  async findExactMatch(
    outgoing_id: number,
    incoming_id: number,
  ): Promise<Friend | null> {
    const found = await this.friendRepository.findOneBy({
      outgoing_friend: { id: outgoing_id },
      incoming_friend: { id: incoming_id },
    });

    if (!found) {
      throw new EntityNotFoundError(
        Friend,
        'outgoing_id: ' + outgoing_id + ', incoming_id: ' + incoming_id,
      );
    }
    return found;
  }

  async update(friendDto: UpdateFriendDto) {
    const friendship = await this.findExactMatch(
      friendDto.outgoing_id,
      friendDto.incoming_id,
    );
    if (friendship.status === FriendStatus.Pending) {
      this.updateFriendRequest(friendDto);
    } else if (friendship.status === FriendStatus.Friends) {
      if (friendDto.action === FriendAction.Block)
        await this.friendRepository.update(friendship.id, {
          status: FriendStatus.Blocked,
        });
    } else if (friendship.status === FriendStatus.Blocked) {
      if (friendDto.action === FriendAction.Unblock) {
        await this.friendRepository.update(friendship.id, {
          status: FriendStatus.Friends,
        });
      }
    }
  }

  async updateFriendRequest(friendDto: UpdateFriendDto) {
    if (friendDto.action === FriendAction.Accept) {
      Promise.all([
        this.friendRepository.update(
          {
            outgoing_friend: { id: friendDto.outgoing_id },
            incoming_friend: { id: friendDto.incoming_id },
          },
          { status: FriendStatus.Friends },
        ),
        this.friendRepository.update(
          {
            outgoing_friend: { id: friendDto.incoming_id },
            incoming_friend: { id: friendDto.outgoing_id },
          },
          { status: FriendStatus.Friends },
        ),
      ]);
    } else if (friendDto.action === FriendAction.Reject)
      await this.deleteRelationship(
        friendDto.outgoing_id,
        friendDto.incoming_id,
      );
  }

  async remove(id: number) {
    return await this.friendRepository.delete(id);
  }

  async deleteRelationship(
    outgoing_id: number,
    incoming_id: number,
  ): Promise<void> {
    Promise.all([
      this.friendRepository.delete({
        outgoing_friend: { id: outgoing_id },
        incoming_friend: { id: incoming_id },
      }),
      this.friendRepository.delete({
        outgoing_friend: { id: incoming_id },
        incoming_friend: { id: outgoing_id },
      }),
    ]);
  }
}
