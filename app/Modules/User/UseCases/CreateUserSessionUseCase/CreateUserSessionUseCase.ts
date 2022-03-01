import AppException from 'App/Shared/Exceptions/AppException';
import HttpContext from '@ioc:Adonis/Core/HttpContext';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import I18n from '@ioc:Adonis/Addons/I18n';
import crypto from 'crypto';

import { IUser } from '../../Interfaces/IUser';
import { inject, injectable } from 'tsyringe';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import { IToken } from '../../Interfaces/IToken';
import { DateTime } from 'luxon';

@injectable()
export class CreateUserSessionUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository,
    @inject('TokensRepository')
    private tokensRepository: IToken.Repository
  ) {}

  public async execute(email: string, password: string, auth: AuthContract) {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const user = await this.usersRepository.findBy('email', email);

    if (!user) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user'),
        })
      );
    }

    try {
      const token = await auth.use('api').attempt(email, password, { expiresIn: '5mins' });

      const stringToken = crypto.randomBytes(32).toString('hex');

      await this.tokensRepository.store({
        user_id: user.id,
        type: 'refresh_token',
        expires_at: DateTime.now().plus({ days: 15 }),
        name: 'Refresh Token',
        token: stringToken,
      });

      return { ...user.toJSON(), authentication_token: token.token, refresh_token: stringToken };
    } catch (error) {
      throw new AppException(error.message);
    }
  }
}
