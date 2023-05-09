import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
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

  @Get(':uid')
  getOneMatch(@Param('uid', ParseIntPipe) uid: number): Promise<MatchHistory> {
    return this.matchHistoryService.findOneMatch(uid);
  }

  // @Put(':uid')
  // update(@Param('uid', ParseIntPipe) uid: number, @Body() updateMatchHistoryDto: UpdateMatchHistoryDto): Promise<void> {
  //   return this.matchHistoryService.update(uid, updateMatchHistoryDto);
  // }

  @Delete(':id')
  removeUser(@Param('uid', ParseIntPipe) uid: number) {
    return this.matchHistoryService.removeMatchHistory(uid);
  }
}
