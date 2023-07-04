import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export enum UserSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  NAME = 'NAME',
  TOKEN = 'TOKEN',
  RELATION = 'RELATION',
}

export enum UserRelation {
  CHANNELS = 'CHANNELS',
  MESSAGES = 'MESSAGES',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  FRIENDS = 'FRIENDS',
}

export class UserGetQueryParams {
  @IsNotEmpty()
  @IsEnum(UserSearchType)
  search_type: UserSearchType;

  @ValidateIf(
    (params: UserGetQueryParams) =>
      params.search_type === UserSearchType.ONE ||
      params.search_type === UserSearchType.RELATION,
  )
  @Transform(({ obj, value }: { obj: UserGetQueryParams; value: number }) =>
    obj.search_type === UserSearchType.ONE ||
    obj.search_type === UserSearchType.RELATION
      ? value
      : undefined,
  )
  @IsNumber()
  search_number: number;

  @ValidateIf(
    (params: UserGetQueryParams) =>
      params.search_type === UserSearchType.NAME ||
      params.search_type === UserSearchType.TOKEN,
  )
  @Transform(({ obj, value }: { obj: UserGetQueryParams; value: number }) =>
    obj.search_type === UserSearchType.NAME ||
    obj.search_type === UserSearchType.TOKEN
      ? value
      : undefined,
  )
  @IsString()
  search_string: string;

  @ValidateIf(
    (params: UserGetQueryParams) =>
      params.search_type === UserSearchType.RELATION,
  )
  @Transform(({ obj, value }: { obj: UserGetQueryParams; value: number }) =>
    obj.search_type === UserSearchType.RELATION ? value : undefined,
  )
  @IsEnum(UserRelation)
  search_relation: UserRelation;

  @IsOptional()
  @Transform(() => true)
  load_relations: boolean;
}
