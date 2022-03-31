import { IToken } from '../../Interfaces/IToken';
import Token from '../../Models/Token';

export class TokensRepositoryInMemory implements IToken.Repository {
  public tokens: Token[] = [];

  public async store({ expires_at, name, token, type, user_id }: IToken.DTO.Store): Promise<Token> {
    const createdToken = new Token();

    Object.assign(createdToken, {
      expires_at,
      name,
      token,
      type,
      user_id,
      id: this.tokens.length + 1,
    });

    this.tokens.push(createdToken);

    return createdToken;
  }

  public async findRefreshToken(token: string): Promise<Token | null> {
    const foundToken = this.tokens.find(
      (currentToken) => currentToken.token === token && currentToken.type === 'refresh_token'
    );

    if (!foundToken) return null;

    return foundToken;
  }

  public async findForgotPasswordToken(token: string): Promise<Token | null> {
    const foundToken = this.tokens.find(
      (currentToken) => currentToken.token === token && currentToken.type === 'forgot_password'
    );

    if (!foundToken) return null;

    return foundToken;
  }

  public async revokeById(token_id: number): Promise<void> {
    const foundToken = this.tokens.find((currentToken) => currentToken.id === token_id);

    if (foundToken) {
      foundToken.is_revoked = true;
    }
  }
}
