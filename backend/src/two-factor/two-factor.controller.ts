import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { TwoFactor } from './entities/two-factor.entity';
import { TwoFactorService } from './two-factor.service';
import { CreateTwoFactorDto } from './dto/create-two-factor.dto';
import { RemoveTwoFactorDto } from './dto/remove-two-factor.dto';
import {
  TwoFactorGetQueryParams,
  TwoFactorSearchType,
} from './params/get-query-params';

@Controller('two-factor')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Post()
  async create(@Body() twoFactorDto: CreateTwoFactorDto): Promise<TwoFactor> {
    return this.twoFactorService.create(twoFactorDto);
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
