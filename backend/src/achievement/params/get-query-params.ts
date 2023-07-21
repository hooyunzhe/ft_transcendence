import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export enum AchievementSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  NAME = 'NAME',
  RELATION = 'RELATION',
}

export enum AchievementRelation {
  ACHIEVERS = 'ACHIEVERS',
}

export class AchievementGetQueryParams {
  @IsNotEmpty()
  @IsEnum(AchievementSearchType)
  search_type: AchievementSearchType;

  @ValidateIf(
    (params: AchievementGetQueryParams) =>
      params.search_type === AchievementSearchType.ONE ||
      params.search_type === AchievementSearchType.RELATION,
  )
  @Transform(
    ({ obj, value }: { obj: AchievementGetQueryParams; value: number }) =>
      obj.search_type === AchievementSearchType.ONE ||
      obj.search_type === AchievementSearchType.RELATION
        ? value
        : undefined,
  )
  @IsNumber()
  search_number: number;

  @ValidateIf(
    (params: AchievementGetQueryParams) =>
      params.search_type === AchievementSearchType.NAME,
  )
  @Transform(
    ({ obj, value }: { obj: AchievementGetQueryParams; value: number }) =>
      obj.search_type === AchievementSearchType.NAME ? value : undefined,
  )
  @IsString()
  search_string: string;

  @ValidateIf(
    (params: AchievementGetQueryParams) =>
      params.search_type === AchievementSearchType.RELATION,
  )
  @Transform(
    ({ obj, value }: { obj: AchievementGetQueryParams; value: number }) =>
      obj.search_type === AchievementSearchType.RELATION ? value : undefined,
  )
  @IsEnum(AchievementRelation)
  search_relation: AchievementRelation;

  @IsOptional()
  @Transform(() => true)
  load_relations: boolean;
}
