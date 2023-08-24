import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { authenticator } from 'otplib';
import { TwoFactor } from './entities/two-factor.entity';
import { UserService } from 'src/user/user.service';
import { CreateTwoFactorDto } from './dto/create-two-factor.dto';
import { SetupTwoFactorDto } from './dto/setup-two-factor.dto';
import { VerifyTwoFactorDto } from './dto/verify-two-factor.dto';
import { RemoveTwoFactorDto } from './dto/remove-two-factor.dto';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(TwoFactor)
    private twoFactorRepository: Repository<TwoFactor>,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async create(twoFactorDto: CreateTwoFactorDto): Promise<{
    secretKey: string;
    otpAuthUrl: string;
  }> {
    const userFound = await this.userService.findOne(
      twoFactorDto.user_id,
      false,
    );
    const secretKey = authenticator.generateSecret();

    return {
      secretKey: secretKey,
      otpAuthUrl: authenticator.keyuri(
        userFound.username,
        'Cyberpong™',
        secretKey,
      ),
    };
  }

  async save(twoFactorDto: SetupTwoFactorDto): Promise<TwoFactor> {
    const userFound = await this.userService.findOne(
      twoFactorDto.user_id,
      false,
    );

    return await this.twoFactorRepository.save({
      secret_key: twoFactorDto.secret_key,
      user: userFound,
    });
  }

  async setup(twoFactorDto: SetupTwoFactorDto): Promise<TwoFactor | null> {
    if (authenticator.check(twoFactorDto.token, twoFactorDto.secret_key)) {
      return this.save(twoFactorDto);
    } else {
      throw new ForbiddenException();
    }
  }

  async verify(twoFactorDto: VerifyTwoFactorDto): Promise<boolean> {
    const twoFactorFound = await this.findByUser(twoFactorDto.user_id);

    return authenticator.check(twoFactorDto.token, twoFactorFound.secret_key);
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

  async findByUser(userID: number): Promise<TwoFactor | null> {
    const found = await this.twoFactorRepository.findOneBy({
      user: { id: userID },
    });

    if (!found) {
      throw new EntityNotFoundError(TwoFactor, 'user_id = ' + userID);
    }
    return found;
  }

  async remove(twoFactorDto: RemoveTwoFactorDto): Promise<void> {
    await this.twoFactorRepository.delete({
      user: { id: twoFactorDto.user_id },
    });
  }
}
