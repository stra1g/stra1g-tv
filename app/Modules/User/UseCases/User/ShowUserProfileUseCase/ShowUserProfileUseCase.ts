import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';

import { IUser } from '../../../Interfaces/IUser';
import User from '../../../Models/User';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ShowUserProfileUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository
  ) {}

  public async execute(user_id: number): Promise<User | NotFoundException> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const user = await this.usersRepository.findBy('id', user_id);

    if (!user) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user'),
        })
      );
    }

    return user;
  }
}
