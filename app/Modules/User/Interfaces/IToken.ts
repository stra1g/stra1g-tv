import { DateTime } from 'luxon';
import Token from '../Models/Token';

export namespace IToken {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<Token>;
    findByRefreshToken(token: string): Promise<Token | null>;
    revokeById(token_id: number): Promise<void>;
  }

  export interface Helpers {}

  export namespace DTO {
    export interface Store {
      name: string;
      token: string;
      type: string;
      expires_at: DateTime;
      user_id: number;
    }
  }
}
