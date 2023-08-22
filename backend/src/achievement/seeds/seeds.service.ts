import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/achievement.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
  ) {}

  async seedAchievements(): Promise<void> {
    if ((await this.achievementsRepository.count()) > 0) {
      return Logger.log('Achievements are already seeded', 'SeedService');
    }
    const achievementsToSeed = [
      {
        name: 'Dont wanna be lonely no more',
        description: 'Send a friend request',
      },
      {
        name: "I don't love you, like I did, yesterday",
        description: 'Delete a friend',
      },
      { name: 'Welcome on board matey', description: 'Add a channel member' },
      {
        name: 'Off the plank you go',
        description: 'Boot a person off a channel',
      },
      {
        name: 'Chatterbox',
        description: 'Message 20 times in the same channel',
      },
      { name: 'Being a boss', description: 'Create a channel' },
      { name: 'Societal cog', description: 'Join a channel' },
      { name: 'My First Game!', description: 'Play a game of pong' },
      {
        name: 'Master sergeant shooter person',
        description: 'Max a skill tree',
      },
      {
        name: 'Wai you so pro',
        description: 'Have a 5 win streak',
      },
      {
        name: 'Showing the Inner Ding Hang',
        description: 'Achieved a flawless victory',
      },
      {
        name: 'Hidden',
        description: 'Hidden',
      },
    ];
    await this.achievementsRepository.save(achievementsToSeed);
    Logger.log('Achievements have been seeded', 'SeedService');
  }
}
