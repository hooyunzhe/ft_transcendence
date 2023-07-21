import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export enum UserAchievementSearchType {
  ALL = 'ALL',
  ONE = 'ONE',
  USER = 'USER',
  ACHIEVEMENT = 'ACHIEVEMENT',
  EXACT = 'EXACT',
}

export class UserAchievementGetQueryParams {
  @IsNotEmpty()
  @IsEnum(UserAchievementSearchType)
  search_type: UserAchievementSearchType;

  @ValidateIf(
    (params: UserAchievementGetQueryParams) =>
      params.search_type !== UserAchievementSearchType.ALL,
  )
  @Transform(
    ({ obj, value }: { obj: UserAchievementGetQueryParams; value: number }) =>
      obj.search_type !== UserAchievementSearchType.ALL ? value : undefined,
  )
  @IsNumber()
  search_number: number;

  @ValidateIf(
    (params: UserAchievementGetQueryParams) =>
      params.search_type === UserAchievementSearchType.EXACT,
  )
  @Transform(
    ({ obj, value }: { obj: UserAchievementGetQueryParams; value: number }) =>
      obj.search_type === UserAchievementSearchType.EXACT ? value : undefined,
  )
  @IsNumber()
  second_search_number: number;
}
