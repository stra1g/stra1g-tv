import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { container, inject, injectable } from 'tsyringe';

import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import Streaming from 'App/Modules/Channel/Models/Streaming';
import AppException from 'App/Shared/Exceptions/AppException';
import { GetUserStreamingUrlUseCase } from '../GetUserStreamingUrlUseCase/GetUserStreamingUrlUseCase';

interface StoreStreamingRequest extends IStreaming.DTO.Store {
  userId: number;
}

interface StoreStreamingResponse {
  streaming: Streaming;
  url: string;
}

@injectable()
export class StoreStreamingUseCase {
  constructor(
    @inject('StreamingsRepository')
    private streamingsRepository: IStreaming.Repository
  ) {}

  public async execute({
    channel_id,
    description,
    title,
    video_url,
    userId,
  }: StoreStreamingRequest): Promise<StoreStreamingResponse | AppException> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

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

    const getUserStreamingUrlUseCase = container.resolve(GetUserStreamingUrlUseCase);
    const url = await getUserStreamingUrlUseCase.execute(userId);

    return {
      streaming,
      url,
    };
  }
}
