import AppException from 'App/Shared/Exceptions/AppException';
import HttpContext from '@ioc:Adonis/Core/HttpContext';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import I18n from '@ioc:Adonis/Addons/I18n';

import { IUser } from '../../Interfaces/IUser';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateUserSessionUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository
  ) {}

  public async execute(email: string, password: string, auth: AuthContract) {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const user = await this.usersRepository.findBy('email', email);

    if (!user) {
      throw new AppException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user'),
        })
      );
    }

    try {
      const token = await auth.use('api').attempt(email, password);

      return { ...user.toJSON(), authentication_token: token.token };
    } catch (error) {
      throw new AppException(error.message);
    }
  }
}
