import { IsString } from 'class-validator';

export class RejectOrgDto {
  @IsString()
  comment: string;
}
