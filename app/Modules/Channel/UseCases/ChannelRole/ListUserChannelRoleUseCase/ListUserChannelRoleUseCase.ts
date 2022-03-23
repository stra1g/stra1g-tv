import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import { IChannel } from 'App/Modules/Channel/Interfaces/IChannel';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import { IChannelRole } from 'App/Modules/Channel/Interfaces/IChannelRole';

@injectable()
export class ListUserChannelRoleUseCase {
  constructor(
    @inject('ChannelsRepository')
    private channelsRepository: IChannel.Repository,
    @inject('ChannelRolesRepository')
    private channelRolesRepository: IChannelRole.Repository
  ) {}

  public async execute(channelId: number, page: number, perPage: number) {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const channel = await this.channelsRepository.findBy('id', channelId);

    if (!channel) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.channel'),
        })
      );
    }

    const userChannelRoles = await this.channelRolesRepository.listUsersChannelRole(
      channel.id,
      page,
      perPage
    );

    return userChannelRoles;
  }
}
