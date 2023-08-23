import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { TwoFactor } from './entities/two-factor.entity';
import { UserService } from 'src/user/user.service';
import { CreateTwoFactorDto } from './dto/create-two-factor.dto';
import { RemoveTwoFactorDto } from './dto/remove-two-factor.dto';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(TwoFactor)
    private twoFactorRepository: Repository<TwoFactor>,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async create(twoFactorDto: CreateTwoFactorDto): Promise<TwoFactor> {
    const userFound = await this.userService.findOne(
      twoFactorDto.user_id,
      false,
    );

    return await this.twoFactorRepository.save({
      secret_key: twoFactorDto.secret_key,
      user: userFound,
    });
  }

  async findAll(): Promise<TwoFactor[]> {
    return await this.twoFactorRepository.find();
  }

  async findOne(id: number): Promise<TwoFactor | null> {
    const found = await this.twoFactorRepository.findOneBy({
      id,
    });

    if (!found) {
      throw new EntityNotFoundError(TwoFactor, 'id = ' + id);
    }
    return found;
  }

  async findByUser(user_id: number): Promise<TwoFactor | null> {
    const found = await this.twoFactorRepository.findOneBy({
      user: { id: user_id },
    });

    if (!found) {
      throw new EntityNotFoundError(TwoFactor, 'user_id = ' + user_id);
    }
    return found;
  }

  async remove(twoFactorDto: RemoveTwoFactorDto): Promise<void> {
    await this.twoFactorRepository.delete({
      user: { id: twoFactorDto.user_id },
    });
  }
}
