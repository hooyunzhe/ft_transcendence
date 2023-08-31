import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export enum PreferenceSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  USER = 'USER',
}

export class PreferenceGetQueryParams {
  @IsNotEmpty()
  @IsEnum(PreferenceSearchType)
  search_type: PreferenceSearchType;

  @ValidateIf(
    (params: PreferenceGetQueryParams) =>
      params.search_type === PreferenceSearchType.ONE ||
      params.search_type === PreferenceSearchType.USER,
  )
  @Transform(
    ({ obj, value }: { obj: PreferenceGetQueryParams; value: number }) =>
      obj.search_type === PreferenceSearchType.ONE ||
      obj.search_type === PreferenceSearchType.USER
        ? value
        : undefined,
  )
  @IsNumber()
  search_number: number;
}
