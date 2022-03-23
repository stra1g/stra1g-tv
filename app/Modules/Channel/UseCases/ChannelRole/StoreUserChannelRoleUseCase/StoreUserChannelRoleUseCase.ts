import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import { IChannelRole } from 'App/Modules/Channel/Interfaces/IChannelRole';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import AppException from 'App/Shared/Exceptions/AppException';

interface StoreUserChannelRoleRequest {
  channelRoleId: number;
  userId: number;
  channelId: number;
}

@injectable()
export class StoreUserChannelRoleUseCase {
  constructor(
    @inject('ChannelRolesRepository')
    private channelRolesRepository: IChannelRole.Repository
  ) {}

  public async execute({
    channelId,
    channelRoleId,
    userId,
  }: StoreUserChannelRoleRequest): Promise<void | NotFoundException | AppException> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const channelRole = await this.channelRolesRepository.findBy('id', channelRoleId);

    if (!channelRole) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.role'),
        })
      );
    }

    if (channelRole.role === 'owner') {
      throw new AppException(i18n.formatMessage('messages.errors.duplicated_channel_owner'));
    }

    // verify if user has another role in this channel and throw an error

    await this.channelRolesRepository.storeUserChannelRole(channelRole, channelId, userId);
  }
}
