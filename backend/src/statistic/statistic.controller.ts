import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Query,
  Post,
} from '@nestjs/common';
import { Statistic } from './entities/statistic.entity';
import { StatisticService } from './statistic.service';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { RemoveStatisticDto } from './dto/remove-statistic.dto';
import {
  StatisticGetQueryParams,
  StatisticSearchType,
} from './params/get-query-params';
import { CreateStatisticDto } from './dto/create-statistic.dto';

@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Post()
  async create(@Body() statisticDto: CreateStatisticDto): Promise<Statistic> {
    return this.statisticService.create(statisticDto);
  }

  @Get()
  async find(
    @Query() queryParams: StatisticGetQueryParams,
  ): Promise<Statistic[] | Statistic | null> {
    switch (queryParams.search_type) {
      case StatisticSearchType.ALL:
        return this.statisticService.findAll();
      case StatisticSearchType.ONE:
        return this.statisticService.findOne(queryParams.search_number);
      case StatisticSearchType.USER:
        return this.statisticService.findByUser(queryParams.search_number);
    }
  }

  @Patch()
  async update(@Body() statisticDto: UpdateStatisticDto): Promise<void> {
    this.statisticService.update(statisticDto);
  }

  @Delete()
  async remove(@Body() statisticDto: RemoveStatisticDto): Promise<void> {
    this.statisticService.remove(statisticDto);
  }
}
