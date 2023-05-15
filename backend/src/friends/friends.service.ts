import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AfterRemove, Repository } from 'typeorm';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend, FriendStatus } from './entities/friend.entity';
import e from 'express';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
  ) { }

  async create(uid_1: number, uid_2: number): Promise<void> {
    const senderFriendDto = new CreateFriendDto();
    senderFriendDto.p1_uid = uid_1;
    senderFriendDto.p2_uid = uid_2;
    senderFriendDto.status = FriendStatus.Invited;

    const receiverFriendDto = new CreateFriendDto();
    receiverFriendDto.p1_uid = uid_2;
    receiverFriendDto.p2_uid = uid_1;
    receiverFriendDto.status = FriendStatus.Pending;
    Promise.all([
      this.friendRepository.save(senderFriendDto),
      this.friendRepository.save(receiverFriendDto)
    ])
  }

  async findAll() {
    return await this.friendRepository.find();
  }

  async findAllUserFriend(uid: number): Promise<Friend[] | null> {
    return await this.friendRepository.find({ where: { p1_uid: uid } })
  }

  async findExactMatch(uid_1: number, uid_2: number): Promise<Friend | null> {
    return await this.friendRepository.findOneBy({ p1_uid: uid_1, p2_uid: uid_2 });
  }
  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  async deleteRelationship(uid_1: number, uid_2: number): Promise<void> {
    Promise.all([this.remove((await this.findExactMatch(uid_1, uid_2)).uid),
    this.remove((await this.findExactMatch(uid_1, uid_2)).uid),
    ])
  }

  async update(friendDto: CreateFriendDto) {
    const friendhship = await this.findExactMatch(friendDto.p1_uid, friendDto.p2_uid);
    if (friendhship.status === FriendStatus.Pending) {
      this.updateFriendRequest(friendDto);
    }
    else if (friendhship.status == FriendStatus.Friend) {
      if (friendDto.status === FriendStatus.Blocked)
        await this.friendRepository.update(friendhship.uid, { status: friendDto.status });
    }
  }

  async updateFriendRequest(friendDto: CreateFriendDto) {
    if (friendDto.status === FriendStatus.Accept) {
      Promise.all([
        this.friendRepository.update((await this.findExactMatch(friendDto.p1_uid, friendDto.p2_uid)).uid, { status: FriendStatus.Friend }),
        this.friendRepository.update((await this.findExactMatch(friendDto.p2_uid, friendDto.p1_uid)).uid, { status: FriendStatus.Friend }),
      ])
    }
    else if (friendDto.status === FriendStatus.Deny)
      await this.deleteRelationship(friendDto.p1_uid, friendDto.p2_uid);
  }
  async remove(id: number) {
    return await this.friendRepository.delete(id);
  }
}
