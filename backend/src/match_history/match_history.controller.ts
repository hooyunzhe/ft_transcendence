import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MatchHistoryService } from './match_history.service';
import { CreateMatchHistoryDto } from './dto/create_match_history.dto';
import { MatchHistory } from './entities/match_history.entity';

@Controller('match_history')
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Post()
  create(@Body() createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
    return this.matchHistoryService.create(createMatchHistoryDto);
  }

  @Get()
  findAll(): Promise<MatchHistory[]> {
    return this.matchHistoryService.findAll();
  }

  @Get(':uid')
  findOne(
    @Param('uid', ParseIntPipe) uid: number,
  ): Promise<MatchHistory | null> {
    return this.matchHistoryService.findOne(uid);
  }

  @Get('player/:uid')
  findAllWithPlayer(
    @Param('uid', ParseIntPipe) uid: number,
  ): Promise<MatchHistory[]> {
    return this.matchHistoryService.findAllWithPlayer(uid);
  }

  @Delete(':uid')
  remove(@Param('uid', ParseIntPipe) uid: number): Promise<void> {
    return this.matchHistoryService.remove(uid);
  }
}
