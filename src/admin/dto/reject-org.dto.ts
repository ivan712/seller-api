import { IsOptional, IsString } from 'class-validator';

export class RejectOrgDto {
  @IsOptional()
  @IsString()
  comment: string;
}
