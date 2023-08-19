import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export enum StatisticSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  USER = 'USER',
}

export class StatisticGetQueryParams {
  @IsNotEmpty()
  @IsEnum(StatisticSearchType)
  search_type: StatisticSearchType;

  @ValidateIf(
    (params: StatisticGetQueryParams) =>
      params.search_type === StatisticSearchType.ONE ||
      params.search_type === StatisticSearchType.USER,
  )
  @Transform(
    ({ obj, value }: { obj: StatisticGetQueryParams; value: number }) =>
      obj.search_type === StatisticSearchType.ONE ||
      obj.search_type === StatisticSearchType.USER
        ? value
        : undefined,
  )
  @IsNumber()
  search_number: number;
}
