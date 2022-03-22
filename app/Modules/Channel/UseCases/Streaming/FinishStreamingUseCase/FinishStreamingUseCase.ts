import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import Streaming from 'App/Modules/Channel/Models/Streaming';

@injectable()
export class FinishStreamingUseCase {
  constructor(
    @inject('StreamingsRepository')
    private streamingsRepository: IStreaming.Repository
  ) {}

  public async execute(streamingId: number): Promise<Streaming | NotFoundException> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const streaming = await this.streamingsRepository.findBy('id', streamingId);

    if (!streaming || streaming.finished_at) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.streaming'),
        })
      );
    }

    const updatedStreaming = await this.streamingsRepository.finishStreaming(streaming);

    return updatedStreaming;
  }
}
