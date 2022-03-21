import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import { IChannel } from 'App/Modules/Channel/Interfaces/IChannel';
import AppException from 'App/Shared/Exceptions/AppException';
import Channel from 'App/Modules/Channel/Models/Channel';
import { IChannelRole } from 'App/Modules/Channel/Interfaces/IChannelRole';

@injectable()
export class CreateChannelUseCase {
  constructor(
    @inject('ChannelsRepository')
    private channelsRepository: IChannel.Repository,
    @inject('ChannelRolesRepository')
    private channelRolesRepository: IChannelRole.Repository
  ) {}

  public async execute({
    description,
    name,
    user_id,
  }: IChannel.DTO.Store): Promise<Channel | AppException> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const userAlreadyHasChannel = await this.channelsRepository.findBy('user_id', user_id);

    if (userAlreadyHasChannel) {
      throw new AppException(
        i18n.formatMessage('messages.errors.model_already_exists', {
          model: i18n.formatMessage('models.channel'),
        })
      );
    }

    const channel = await this.channelsRepository.store({ description, name, user_id });
    const ownerRole = await this.channelRolesRepository.findBy('role', 'owner');

    if (ownerRole) {
      await channel.related('channelRoles').attach({
        [ownerRole.id]: {
          user_id,
        },
      });
    }

    return channel;
  }
}
