import { HashDriverContract } from '@ioc:Adonis/Core/Hash';
import { hashSync, compareSync } from 'bcrypt';

export class BcryptCustom implements HashDriverContract {
  public async make(value: string): Promise<string> {
    const hash = hashSync(value, 10);

    return hash;
  }

  public async verify(hashedValue: string, plainValue: string): Promise<boolean> {
    const isValid = compareSync(plainValue, hashedValue);

    return isValid;
  }
}
