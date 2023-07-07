import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export enum ChannelMemberSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  CHANNEL = 'CHANNEL',
  USER = 'USER',
  EXACT = 'EXACT',
}

export class ChannelMemberGetQueryParams {
  @IsNotEmpty()
  @IsEnum(ChannelMemberSearchType)
  search_type: ChannelMemberSearchType;

  @ValidateIf(
    (params: ChannelMemberGetQueryParams) =>
      params.search_type !== ChannelMemberSearchType.ALL,
  )
  @Transform(
    ({ obj, value }: { obj: ChannelMemberGetQueryParams; value: number }) =>
      obj.search_type !== ChannelMemberSearchType.ALL ? value : undefined,
  )
  @IsNumber()
  search_number: number;

  @ValidateIf(
    (params: ChannelMemberGetQueryParams) =>
      params.search_type === ChannelMemberSearchType.EXACT,
  )
  @Transform(
    ({ obj, value }: { obj: ChannelMemberGetQueryParams; value: number }) =>
      obj.search_type === ChannelMemberSearchType.EXACT ? value : undefined,
  )
  @IsNumber()
  second_search_number: number;
}
