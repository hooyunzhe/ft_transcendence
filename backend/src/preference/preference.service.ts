import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Preference } from './entities/preference.entity';
import { UserService } from 'src/user/user.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { RemovePreferenceDto } from './dto/remove-preference.dto';
import { EntityAlreadyExistsError } from 'src/app.error';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(Preference)
    private preferenceRepository: Repository<Preference>,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async create(preferenceDto: CreatePreferenceDto): Promise<Preference> {
    const userFound = await this.userService.findOne(
      preferenceDto.user_id,
      false,
    );
    const preferenceFound = await this.preferenceRepository.findOneBy({
      user: { id: userFound.id },
    });

    if (preferenceFound) {
      throw new EntityAlreadyExistsError(
        'Preference',
        'user_id = ' + userFound.id,
      );
    }
    return await this.preferenceRepository.save({
      user: userFound,
    });
  }

  async findAll(): Promise<Preference[]> {
    return await this.preferenceRepository.find();
  }

  async findOne(id: number): Promise<Preference | null> {
    const found = await this.preferenceRepository.findOneBy({
      id,
    });

    if (!found) {
      throw new EntityNotFoundError(Preference, 'id = ' + id);
    }
    return found;
  }

  async findByUser(userID: number): Promise<Preference | null> {
    const userFound = await this.userService.findOne(userID, false);
    const found = await this.preferenceRepository.findOneBy({
      user: { id: userFound.id },
    });

    if (!found) {
      throw new EntityNotFoundError(Preference, 'user_id = ' + userID);
    }
    return found;
  }

  async update(preferenceDto: UpdatePreferenceDto): Promise<void> {
    const currentPreference = await this.findOne(preferenceDto.id);

    if (preferenceDto.music_enabled !== undefined) {
      currentPreference.music_enabled = preferenceDto.music_enabled;
    }
    if (preferenceDto.animations_enabled !== undefined) {
      currentPreference.animations_enabled = preferenceDto.animations_enabled;
    }
    await this.preferenceRepository.save(currentPreference);
  }

  async remove(preferenceDto: RemovePreferenceDto): Promise<void> {
    await this.preferenceRepository.delete(preferenceDto.id);
  }
}
