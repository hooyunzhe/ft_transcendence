import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveMatchDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
