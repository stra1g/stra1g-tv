import I18n from '@ioc:Adonis/Addons/I18n';
import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';

import { IToken } from 'App/Modules/User/Interfaces/IToken';
import { IUser } from 'App/Modules/User/Interfaces/IUser';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import UnauthorizedException from 'App/Shared/Exceptions/UnauthorizedException';

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository,
    @inject('TokensRepository')
    private tokensRepository: IToken.Repository
  ) {}

  public async execute(token: string, password: string) {
    const i18n = I18n.locale('pt-br');

    const foundToken = await this.tokensRepository.findForgotPasswordToken(token);

    if (!foundToken) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', { model: 'Token' })
      );
    }

    if (foundToken.expires_at < DateTime.now()) {
      throw new UnauthorizedException(i18n.formatMessage('messages.errors.expired_token'));
    }

    const user = await this.usersRepository.findBy('id', foundToken.user_id);

    if (!user) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user'),
        })
      );
    }

    user.password = password;
    await user.save();

    await this.tokensRepository.revokeById(foundToken.id);
  }
}
