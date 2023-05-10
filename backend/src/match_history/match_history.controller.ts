import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MatchHistoryService } from './match_history.service';
import { CreateMatchHistoryDto } from './dto/create-match_history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match_history.dto';
import { MatchHistory } from './entities/match_history.entity';

@Controller('matchhistory')
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Post()
  createMatchHistory(@Body() createMatchHistoryDto: CreateMatchHistoryDto) {
    return this.matchHistoryService.createMatchHistory(createMatchHistoryDto);
  }

  @Get()
  getMatches() {
    return this.matchHistoryService.findAllMatch();
  }

  @Get('player')
  getPlayerMatch(
    @Query('player_uid', ParseIntPipe) player_uid: number,
  ): Promise<MatchHistory[]> {
    return this.matchHistoryService.findPlayerMatch(player_uid);
  }

  @Get(':uid')
  getOneMatch(@Param('uid', ParseIntPipe) uid: number): Promise<MatchHistory> {
    return this.matchHistoryService.findOneMatch(uid);
  }

  @Delete(':id')
  removeUser(@Param('uid', ParseIntPipe) uid: number) {
    return this.matchHistoryService.removeMatchHistory(uid);
  }
}
