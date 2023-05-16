import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAchievementDto } from './create-user_achievement.dto';

export class UpdateUserAchievementDto extends PartialType(CreateUserAchievementDto) {}
