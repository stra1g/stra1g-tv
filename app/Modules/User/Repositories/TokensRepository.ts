import { IToken } from '../Interfaces/IToken';
import Token from '../Models/Token';

export class TokensRepository implements IToken.Repository {
  public async store({ expires_at, name, token, type, user_id }: IToken.DTO.Store): Promise<Token> {
    const createdToken = await Token.create({ expires_at, name, token, type, user_id });

    return createdToken;
  }

  public async findByRefreshToken(token: string): Promise<Token | null> {
    const foundToken = await Token.query().where({ token, type: 'refresh_token' }).first();

    return foundToken;
  }

  public async revokeById(token_id: number): Promise<void> {
    await Token.query().where({ id: token_id }).update({ is_revoked: true });
  }
}
