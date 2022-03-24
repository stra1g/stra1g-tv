import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import { IChannelRole } from 'App/Modules/Channel/Interfaces/IChannelRole';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import AppException from 'App/Shared/Exceptions/AppException';
import { IUser } from 'App/Modules/User/Interfaces/IUser';

interface StoreUserChannelRoleRequest {
  channelRoleId: number;
  userId: number;
  channelId: number;
}

@injectable()
export class StoreUserChannelRoleUseCase {
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
  }: StoreUserChannelRoleRequest): Promise<void | NotFoundException | AppException> {
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

    const channelRole = await this.channelRolesRepository.findBy('id', channelRoleId);

    if (!channelRole) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.channelRole'),
        })
      );
    }

    if (channelRole.role === 'owner') {
      throw new AppException(i18n.formatMessage('messages.errors.duplicated_channel_owner'));
    }

    const alreadyHasChannelRole = await this.channelRolesRepository.findUserChannelRole(
      user,
      channelId
    );

    if (alreadyHasChannelRole) {
      throw new AppException(
        i18n.formatMessage('messages.errors.user_already_has_role_in_channel')
      );
    }

    await this.channelRolesRepository.storeUserChannelRole(channelRole, channelId, userId);
  }
}
