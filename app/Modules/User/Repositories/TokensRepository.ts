import { IToken } from '../Interfaces/IToken';
import Token from '../Models/Token';

export class TokensRepository implements IToken.Repository {
  public async store({ expires_at, name, token, type, user_id }: IToken.DTO.Store): Promise<Token> {
    const createdToken = await Token.create({ expires_at, name, token, type, user_id });

    return createdToken;
  }

  public async findRefreshToken(token: string): Promise<Token | null> {
    const foundToken = await Token.query()
      .where({ token, type: IToken.TokenTypes.refreshToken })
      .first();

    return foundToken;
  }

  public async revokeById(token_id: number): Promise<void> {
    await Token.query().where({ id: token_id }).update({ is_revoked: true });
  }

  public async findForgotPasswordToken(token: string): Promise<Token | null> {
    const foundToken = await Token.query()
      .where({ token, type: IToken.TokenTypes.forgotPassword })
      .first();

    return foundToken;
  }

  public async revokeByUserAndType(userId: number, type: string): Promise<void> {
    await Token.query().where({ user_id: userId, type }).update({ is_revoked: true });
  }
}
