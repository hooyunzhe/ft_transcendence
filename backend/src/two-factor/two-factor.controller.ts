import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { TwoFactor } from './entities/two-factor.entity';
import { TwoFactorService } from './two-factor.service';
import { CreateTwoFactorDto } from './dto/create-two-factor.dto';
import { SetupTwoFactorDto } from './dto/setup-two-factor.dto';
import { VerifyTwoFactorDto } from './dto/verify-two-factor.dto';
import { RemoveTwoFactorDto } from './dto/remove-two-factor.dto';
import {
  TwoFactorGetQueryParams,
  TwoFactorSearchType,
} from './params/get-query-params';

@Controller('two-factor')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Post()
  async create(@Body() twoFactorDto: CreateTwoFactorDto): Promise<{
    secretKey: string;
    otpAuthUrl: string;
  }> {
    return this.twoFactorService.create(twoFactorDto);
  }

  @Post('setup')
  async setup(
    @Body() twoFactorDto: SetupTwoFactorDto,
  ): Promise<TwoFactor | null> {
    return this.twoFactorService.setup(twoFactorDto);
  }

  @Post('verify')
  async verify(
    @Body() twoFactorDto: VerifyTwoFactorDto,
  ): Promise<{ verified: boolean }> {
    return this.twoFactorService.verify(twoFactorDto);
  }

  @Get()
  async find(
    @Query() queryParams: TwoFactorGetQueryParams,
  ): Promise<TwoFactor[] | TwoFactor | null> {
    switch (queryParams.search_type) {
      case TwoFactorSearchType.ALL:
        return this.twoFactorService.findAll();
      case TwoFactorSearchType.ONE:
        return this.twoFactorService.findOne(queryParams.search_number);
      case TwoFactorSearchType.USER:
        return this.twoFactorService.findByUser(queryParams.search_number);
    }
  }

  @Delete()
  async remove(@Body() twoFactorDto: RemoveTwoFactorDto): Promise<void> {
    return this.twoFactorService.remove(twoFactorDto);
  }
}
