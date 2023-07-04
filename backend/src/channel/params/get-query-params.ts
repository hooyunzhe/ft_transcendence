import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export enum ChannelSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  NAME = 'NAME',
  RELATION = 'RELATION',
}

export enum ChannelRelation {
  MEMBERS = 'MEMBERS',
  MESSAGES = 'MESSAGES',
}

export class ChannelGetQueryParams {
  @IsNotEmpty()
  @IsEnum(ChannelSearchType)
  search_type: ChannelSearchType;

  @ValidateIf(
    (params: ChannelGetQueryParams) =>
      params.search_type === ChannelSearchType.ONE ||
      params.search_type === ChannelSearchType.RELATION,
  )
  @Transform(({ obj, value }: { obj: ChannelGetQueryParams; value: number }) =>
    obj.search_type === ChannelSearchType.ONE ||
    obj.search_type === ChannelSearchType.RELATION
      ? value
      : undefined,
  )
  @IsNumber()
  search_number: number;

  @ValidateIf(
    (params: ChannelGetQueryParams) =>
      params.search_type === ChannelSearchType.NAME,
  )
  @Transform(({ obj, value }: { obj: ChannelGetQueryParams; value: number }) =>
    obj.search_type === ChannelSearchType.NAME ? value : undefined,
  )
  @IsString()
  search_string: string;

  @ValidateIf(
    (params: ChannelGetQueryParams) =>
      params.search_type === ChannelSearchType.RELATION,
  )
  @Transform(({ obj, value }: { obj: ChannelGetQueryParams; value: number }) =>
    obj.search_type === ChannelSearchType.RELATION ? value : undefined,
  )
  @IsEnum(ChannelRelation)
  search_relation: ChannelRelation;

  @IsOptional()
  @Transform(() => true)
  load_relations: boolean;
}
