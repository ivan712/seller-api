import { ThirdPartyApi as ThirdPartyApiModel } from '@prisma/client';

export class ThirdPartyApi {
  key: string;
  url: string;
  token: string;
  expiredAt: Date;

  constructor({ pgDoc }: { pgDoc?: ThirdPartyApiModel }) {
    this.key = pgDoc.key;
    this.url = pgDoc.url;
    this.token = pgDoc.token;
    this.expiredAt = pgDoc.expiredAt;
  }
}
