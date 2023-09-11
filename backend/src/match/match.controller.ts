import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { Match } from './entities/match.entity';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { RemoveMatchDto } from './dto/remove.match.dto';
import {
  MatchGetQueryParams,
  MatchSearchType,
} from './params/get-query-params';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  async create(@Body() matchDto: CreateMatchDto): Promise<Match> {
    return this.matchService.create(matchDto);
  }

  @Get()
  async find(
    @Query() queryParams: MatchGetQueryParams,
  ): Promise<Match[] | Match | null> {
    switch (queryParams.search_type) {
      case MatchSearchType.ALL:
        return this.matchService.findAll();
      case MatchSearchType.ONE:
        return this.matchService.findOne(queryParams.search_number);
      case MatchSearchType.LATEST:
        return this.matchService.findOneWithBothPlayers(
          queryParams.search_number,
          queryParams.second_search_number,
        );
      case MatchSearchType.USER:
        return this.matchService.findAllWithPlayer(queryParams.search_number);
      case MatchSearchType.WINNER:
        return this.matchService.findAllWithWinner(queryParams.search_number);
      case MatchSearchType.BOTH:
        return this.matchService.findAllWithBothPlayers(
          queryParams.search_number,
          queryParams.second_search_number,
        );
    }
  }

  @Delete()
  async remove(@Body() matchDto: RemoveMatchDto): Promise<void> {
    return this.matchService.remove(matchDto);
  }
}
