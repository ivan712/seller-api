import { OrgType } from '../organization.entity';

export interface IApiDocDadata {
  unrestricted_value: string;
  data: {
    inn: string;
    type: OrgType;
    ogrn: string;
    address: {
      unrestricted_value: string;
    };
  };
}
