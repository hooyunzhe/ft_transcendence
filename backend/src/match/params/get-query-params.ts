import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export enum MatchSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  USER = 'USER',
  WINNER = 'WINNER',
  BOTH = 'BOTH',
}

export class MatchGetQueryParams {
  @IsNotEmpty()
  @IsEnum(MatchSearchType)
  search_type: MatchSearchType;

  @ValidateIf(
    (params: MatchGetQueryParams) => params.search_type !== MatchSearchType.ALL,
  )
  @Transform(({ obj, value }: { obj: MatchGetQueryParams; value: number }) =>
    obj.search_type !== MatchSearchType.ALL ? value : undefined,
  )
  @IsNumber()
  search_number: number;

  @ValidateIf(
    (params: MatchGetQueryParams) =>
      params.search_type === MatchSearchType.BOTH,
  )
  @Transform(({ obj, value }: { obj: MatchGetQueryParams; value: number }) =>
    obj.search_type === MatchSearchType.BOTH ? value : undefined,
  )
  @IsNumber()
  second_search_number: number;
}
