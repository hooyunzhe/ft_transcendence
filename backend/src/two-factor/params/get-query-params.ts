import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export enum TwoFactorSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  USER = 'USER',
}

export class TwoFactorGetQueryParams {
  @IsNotEmpty()
  @IsEnum(TwoFactorSearchType)
  search_type: TwoFactorSearchType;

  @ValidateIf(
    (params: TwoFactorGetQueryParams) =>
      params.search_type === TwoFactorSearchType.ONE ||
      params.search_type === TwoFactorSearchType.USER,
  )
  @Transform(
    ({ obj, value }: { obj: TwoFactorGetQueryParams; value: number }) =>
      obj.search_type === TwoFactorSearchType.ONE ||
      obj.search_type === TwoFactorSearchType.USER
        ? value
        : undefined,
  )
  @IsNumber()
  search_number: number;
}
