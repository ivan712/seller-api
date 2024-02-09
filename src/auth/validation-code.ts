import * as crypto from 'crypto';
import { genSalt, hash, compare } from 'bcryptjs';

export class ValidationCode {
  private codeHash: string;
  private expiredAt: String;
  private phoneNumber: string;

  constructor(codeData?: { pgDoc?: any }) {
    if (codeData?.pgDoc) {
      this.phoneNumber = codeData.pgDoc.phoneNumber;
      this.codeHash = codeData.pgDoc.codeHash;
      this.expiredAt = codeData.pgDoc.expiredAt;
    }
  }

  private async generateRandomNumber(min, max): Promise<number> {
    return new Promise((res, error) => {
      crypto.randomInt(min, max + 1, (err, n) => {
        if (err) error(err);
        res(n);
      });
    });
  }

  async generate(phoneNumber: string): Promise<ValidationCode> {
    this.phoneNumber = phoneNumber;
    this.expiredAt = String(new Date());
    //hardcode
    const randomNumber = await this.generateRandomNumber(0, 9999);
    const code = String(randomNumber).padStart(4, '0');
    console.log('code', code);
    const salt = await genSalt(10);
    this.codeHash = await hash(code, salt);
    // this.code = String(1234);

    return this;
  }

  getCodeHash(): string {
    return this.codeHash;
  }

  getExpiredAt(): String {
    return this.expiredAt;
  }

  getPhoneNumber(): string {
    return this.phoneNumber;
  }

  async validate(code: string): Promise<Boolean> {
    //hardcode
    console.log('code from user', code);
    console.log('compare', compare);
    console.log('this.codeHash', this.codeHash);
    const isCodeValid = await compare(code, this.codeHash);
    return isCodeValid;
  }
}
