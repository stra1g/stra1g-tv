import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import I18n from '@ioc:Adonis/Addons/I18n';
import crypto from 'crypto';
import { inject, injectable } from 'tsyringe';

import { IToken } from 'App/Modules/User/Interfaces/IToken';
import { IUser } from 'App/Modules/User/Interfaces/IUser';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import { DateTime } from 'luxon';
import AppException from 'App/Shared/Exceptions/AppException';

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('TokensRepository')
    private tokensRepository: IToken.Repository,
    @inject('UsersRepository')
    private usersRepository: IUser.Repository
  ) {}

  public async execute(token: string, auth: AuthContract) {
    const i18n = I18n.locale('pt-br');

    const tokenExists = await this.tokensRepository.findRefreshToken(token);

    if (!tokenExists) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', { model: 'Token' })
      );
    }

    const user = await this.usersRepository.findBy('id', tokenExists.user_id);

    if (!user) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user'),
        })
      );
    }

    await this.tokensRepository.revokeById(tokenExists.id);

    try {
      const token = await auth.use('api').generate(user, { expiresIn: '5mins' });

      const stringToken = crypto.randomBytes(32).toString('hex');

      await this.tokensRepository.store({
        user_id: user.id,
        type: IToken.TokenTypes.refreshToken,
        expires_at: DateTime.now().plus({ days: 15 }),
        name: 'Refresh Token',
        token: stringToken,
      });

      return { access_token: token.token, refresh_token: stringToken };
    } catch (error) {
      throw new AppException(error.message);
    }
  }
}
