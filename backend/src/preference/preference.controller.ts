import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { Preference } from './entities/preference.entity';
import { PreferenceService } from './preference.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { RemovePreferenceDto } from './dto/remove-preference.dto';
import {
  PreferenceGetQueryParams,
  PreferenceSearchType,
} from './params/get-query-params';

@Controller('preferences')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Post()
  async create(
    @Body() preferenceDto: CreatePreferenceDto,
  ): Promise<Preference> {
    return this.preferenceService.create(preferenceDto);
  }

  @Get()
  async find(
    @Query() queryParams: PreferenceGetQueryParams,
  ): Promise<Preference[] | Preference | null> {
    switch (queryParams.search_type) {
      case PreferenceSearchType.ALL:
        return this.preferenceService.findAll();
      case PreferenceSearchType.ONE:
        return this.preferenceService.findOne(queryParams.search_number);
      case PreferenceSearchType.USER:
        return this.preferenceService.findByUser(queryParams.search_number);
    }
  }

  @Patch()
  async update(@Body() preferenceDto: UpdatePreferenceDto): Promise<void> {
    return this.preferenceService.update(preferenceDto);
  }

  @Delete()
  async remove(@Body() preferenceDto: RemovePreferenceDto): Promise<void> {
    return this.preferenceService.remove(preferenceDto);
  }
}
