import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export enum MessageSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  CHANNEL = 'CHANNEL',
  USER = 'USER',
}

export class MessageGetQueryParams {
  @IsNotEmpty()
  @IsEnum(MessageSearchType)
  search_type: MessageSearchType;

  @ValidateIf(
    (params: MessageGetQueryParams) =>
      params.search_type !== MessageSearchType.ALL,
  )
  @Transform(({ obj, value }: { obj: MessageGetQueryParams; value: number }) =>
    obj.search_type !== MessageSearchType.ALL ? value : undefined,
  )
  @IsNumber()
  search_number: number;

  @ValidateIf(
    (params: MessageGetQueryParams) =>
      params.search_type === MessageSearchType.USER,
  )
  @Transform(({ obj, value }: { obj: MessageGetQueryParams; value: number }) =>
    obj.search_type === MessageSearchType.USER ? value : undefined,
  )
  @IsNumber()
  second_search_number: number;
}
