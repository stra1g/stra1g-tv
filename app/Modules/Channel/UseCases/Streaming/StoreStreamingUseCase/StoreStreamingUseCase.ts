import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import Streaming from 'App/Modules/Channel/Models/Streaming';
import AppException from 'App/Shared/Exceptions/AppException';
import { IChannel } from 'App/Modules/Channel/Interfaces/IChannel';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';

interface StoreStreamingResponse {
  streaming: Streaming;
  url: string;
}

@injectable()
export class StoreStreamingUseCase {
  constructor(
    @inject('StreamingsRepository')
    private streamingsRepository: IStreaming.Repository,
    @inject('ChannelsRepository')
    private channelsRepository: IChannel.Repository
  ) {}

  public async execute({
    channel_id,
    description,
    title,
    video_url,
  }: IStreaming.DTO.Store): Promise<StoreStreamingResponse | AppException> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const channel = await this.channelsRepository.findBy('id', channel_id);

    if (!channel) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.channel'),
        })
      );
    }

    const alreadyHasOnlineStreaming = await this.streamingsRepository.findOnlineStreamingByChannel(
      channel_id
    );

    if (alreadyHasOnlineStreaming) {
      throw new AppException(i18n.formatMessage('messages.errors.another_online_streaming'));
    }

    const streaming = await this.streamingsRepository.store({
      channel_id,
      description,
      title,
      video_url,
    });

    const url = `rtmp://localhost/live`;

    return {
      streaming,
      url,
    };
  }
}
