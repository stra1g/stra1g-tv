import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import { IChannelRole } from 'App/Modules/Channel/Interfaces/IChannelRole';
import { IUser } from 'App/Modules/User/Interfaces/IUser';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import AppException from 'App/Shared/Exceptions/AppException';

interface UpdateUserChannelRoleRequest {
  channelRoleId: number;
  userId: number;
  channelId: number;
}

@injectable()
export class UpdateUserChannelRoleUseCase {
  constructor(
    @inject('ChannelRolesRepository')
    private channelRolesRepository: IChannelRole.Repository,
    @inject('UsersRepository')
    private usersRepository: IUser.Repository
  ) {}

  public async execute({
    channelId,
    channelRoleId,
    userId,
  }: UpdateUserChannelRoleRequest): Promise<void | NotFoundException> {
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

    const userChannelRole = await this.channelRolesRepository.findUserChannelRole(user, channelId);

    if (!userChannelRole) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user_channel_role'),
        })
      );
    }

    const channelRole = await this.channelRolesRepository.findBy('id', channelRoleId);

    if (!channelRole) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.channel_role'),
        })
      );
    }

    if (channelRole.role === 'owner') {
      throw new AppException(i18n.formatMessage('messages.errors.duplicated_channel_owner'));
    }

    await this.channelRolesRepository.updateUserChannelRole(user, channelId, channelRoleId);
  }
}
