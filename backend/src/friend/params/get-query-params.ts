import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export enum FriendSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  USER = 'USER',
  EXACT = 'EXACT',
}

export class FriendGetQueryParams {
  @IsNotEmpty()
  @IsEnum(FriendSearchType)
  search_type: FriendSearchType;

  @ValidateIf(
    (params: FriendGetQueryParams) =>
      params.search_type !== FriendSearchType.ALL,
  )
  @Transform(({ obj, value }: { obj: FriendGetQueryParams; value: number }) =>
    obj.search_type !== FriendSearchType.ALL ? value : undefined,
  )
  @IsNumber()
  search_number: number;

  @ValidateIf(
    (params: FriendGetQueryParams) =>
      params.search_type === FriendSearchType.EXACT,
  )
  @Transform(({ obj, value }: { obj: FriendGetQueryParams; value: number }) =>
    obj.search_type === FriendSearchType.EXACT ? value : undefined,
  )
  @IsNumber()
  second_search_number: number;
}
