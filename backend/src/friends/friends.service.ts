import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AfterRemove, Repository } from 'typeorm';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend, FriendStatus } from './entities/friend.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
  ) { }

  async create(user1_id: number, user2_id: number): Promise<void> {
    const senderFriendDto = new CreateFriendDto();
    senderFriendDto.user1_id = user1_id;
    senderFriendDto.user2_id = user2_id;
    senderFriendDto.status = FriendStatus.Invited;

    const receiverFriendDto = new CreateFriendDto();
    receiverFriendDto.user1_id = user2_id;
    receiverFriendDto.user2_id = user1_id;
    receiverFriendDto.status = FriendStatus.Pending;
    await this.friendRepository.save([senderFriendDto, receiverFriendDto]);
  }

  async findAll() {
    return await this.friendRepository.find();
  }

  async findAllUserFriend(user1_id: number): Promise<Friend[] | null> {
    return await this.friendRepository.findBy({ user1_id });
  }
  
  async findOne(id: number): Promise<Friend | null> {
    return await this.friendRepository.findOneBy({ id });
  }
      
  async findExactMatch(user1_id: number, user2_id: number): Promise<Friend | null> {
    return await this.friendRepository.findOneBy({ user1_id, user2_id });
  }

  async deleteRelationship(user1_id: number, user2_id: number): Promise<void> {
    Promise.all([this.remove((await this.findExactMatch(user1_id, user2_id)).id),
    this.remove((await this.findExactMatch(user2_id, user1_id)).id),
    ])
  }

  async update(friendDto: CreateFriendDto) {
    const friendhship = await this.findExactMatch(friendDto.user1_id, friendDto.user2_id);
    if (friendhship.status === FriendStatus.Pending) {
      this.updateFriendRequest(friendDto);
    }
    else if (friendhship.status == FriendStatus.Friend) {
      if (friendDto.status === FriendStatus.Blocked)
        await this.friendRepository.update(friendhship.id, { status: friendDto.status });
    }
  }

  async updateFriendRequest(friendDto: CreateFriendDto) {
    if (friendDto.status === FriendStatus.Accept) {
      Promise.all([
        this.friendRepository.update((await this.findExactMatch(friendDto.user1_id, friendDto.user2_id)).id, { status: FriendStatus.Friend }),
        this.friendRepository.update((await this.findExactMatch(friendDto.user2_id, friendDto.user1_id)).id, { status: FriendStatus.Friend }),
      ])
    }
    else if (friendDto.status === FriendStatus.Deny)
      await this.deleteRelationship(friendDto.user1_id, friendDto.user2_id);
  }
  async remove(id: number) {
    return await this.friendRepository.delete(id);
  }
}
