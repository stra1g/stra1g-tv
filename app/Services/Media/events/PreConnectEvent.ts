import Env from '@ioc:Adonis/Core/Env';
import { container, inject, injectable } from 'tsyringe';

import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import { mediaDriverInstance } from '../index';
import { getQueryParams } from '../Utils/getQueryParams';
import { StreamPath } from '../Interfaces/IStreamPath';
import { GetStreamingByTokenUseCase } from '../UseCases/GetStreamingByTokenUseCase/GetStreamingByTokenUseCase';

@injectable()
export class PreConnectEvent {
  constructor(
    @inject('StreamingsRepository')
    private streamingsRepository: IStreaming.Repository
  ) {}

  public async execute(id: string, streamPath: StreamPath, _args: object): Promise<void> {
    const session = mediaDriverInstance.getSession(id);

    if (streamPath.app || streamPath.query) {
      const field = streamPath.app ?? streamPath.query?.auth_token;
      const queryParams = getQueryParams(field);

      if (queryParams.auth_token) {
        const getStreamingByTokenUseCase = container.resolve(GetStreamingByTokenUseCase);

        const streaming = await getStreamingByTokenUseCase.execute(queryParams.auth_token);

        if (!streaming) {
          return session.reject();
        }

        const videoUrl = `${Env.get('APP_URL')}:${Env.get('MEDIA_HTTP_PORT')}/live/${
          streaming.channel.stream_key
        }.flv`;

        console.log(`[VIDEOURL]: ${videoUrl}`);

        await this.streamingsRepository.update(streaming, {
          video_url: videoUrl,
        });
      }
    }
  }
}
