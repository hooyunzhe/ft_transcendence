import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend } from './entities/friend.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
  ) { }

  async create(createFriendDto: CreateFriendDto): Promise<void> {
    await this.friendRepository.save(createFriendDto);
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

  async deleteExactMatch(uid_1: number, uid_2: number): Promise<void> {
    await this.remove((await this.findExactMatch(uid_1, uid_2)).uid);
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return this.friendRepository.update(id, updateFriendDto);
  }

  async remove(id: number) {
    return await this.friendRepository.delete(id);
  }
}
