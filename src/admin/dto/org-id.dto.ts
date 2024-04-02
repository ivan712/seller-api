import { IsUUID } from 'class-validator';

export class OrgIdDto {
  @IsUUID()
  id: string;
}
