import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { SeedService } from './seeds/seeds.service';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  controllers: [AchievementController],
  providers: [AchievementService, SeedService],
  exports: [AchievementService],
})
export class AchievementModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.seedAchievements();
  }
}
