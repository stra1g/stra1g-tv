import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import { IChannel } from 'App/Modules/Channel/Interfaces/IChannel';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';

@injectable()
export class ListUserChannelRoleUseCase {
  constructor(
    @inject('ChannelsRepository')
    private channelsRepository: IChannel.Repository
  ) {}

  public async execute(channelId: number, page: number, perPage: number) {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const channel = await this.channelsRepository.show(channelId);

    if (!channel) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.channel'),
        })
      );
    }

    const userChannelRoles = await this.channelsRepository.listUsersChannelRole(
      channel,
      page,
      perPage
    );

    return userChannelRoles;
  }
}
