import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import { IChannelRole } from 'App/Modules/Channel/Interfaces/IChannelRole';
import { IUser } from 'App/Modules/User/Interfaces/IUser';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';

@injectable()
export class DestroyUserChannelRoleUseCase {
  constructor(
    @inject('ChannelRolesRepository')
    private channelRolesRepository: IChannelRole.Repository,
    @inject('UsersRepository')
    private usersRepository: IUser.Repository
  ) {}

  public async execute(userId: number, channelId: number): Promise<void | NotFoundException> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const user = await this.usersRepository.findBy('id', userId);

    if (!user) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user'),
        })
      );
    }

    await this.channelRolesRepository.destroyUserChannelRole(user, channelId);
  }
}
