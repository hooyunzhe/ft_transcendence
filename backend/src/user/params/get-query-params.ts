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
}

export class UserGetQueryParams {
  @IsNotEmpty()
  @IsEnum(UserSearchType)
  search_type: UserSearchType;

  @ValidateIf(
    (params: UserGetQueryParams) => params.search_type === UserSearchType.ONE,
  )
  @Transform(({ obj, value }: { obj: UserGetQueryParams; value: number }) =>
    obj.search_type === UserSearchType.ONE ? value : undefined,
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

  // @IsOptional()
  // @IsBoolean
}
