import { DateTime } from 'luxon';
import Token from '../Models/Token';

export namespace IToken {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<Token>;
    findRefreshToken(token: string): Promise<Token | null>;
    findForgotPasswordToken(token: string): Promise<Token | null>;
    revokeById(token_id: number): Promise<void>;
    revokeByUserAndType(userId: number, type: TokenTypes): Promise<void>;
  }

  export interface Helpers {}

  export enum TokenTypes {
    refreshToken = 'refresh_token',
    accessToken = 'access_token',
    forgotPassword = 'forgot_password',
  }

  export namespace DTO {
    export interface Store {
      name: string;
      token: string;
      type: TokenTypes;
      expires_at: DateTime | null;
      user_id: number;
    }
  }
}
