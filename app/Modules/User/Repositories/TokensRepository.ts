import { IToken } from '../Interfaces/IToken';
import Token from '../Models/Token';

export class TokensRepository implements IToken.Repository {
  public async store({ expires_at, name, token, type, user_id }: IToken.DTO.Store): Promise<Token> {
    const createdToken = await Token.create({ expires_at, name, token, type, user_id });

    return createdToken;
  }
}
