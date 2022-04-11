import Env from '@ioc:Adonis/Core/Env';
import { container, inject, injectable } from 'tsyringe';

import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import { mediaDriverInstance } from '../index';
import { PrePublishArgs } from '../Interfaces/IStreamPath';
import { GetUserByStreamingKeyUseCase } from '../UseCases/GetUserByStreamingKeyUseCase/GetUserByStreamingKeyUseCase';

@injectable()
export class PrePublishEvent {
  constructor(
    @inject('StreamingsRepository')
    private streamingsRepository: IStreaming.Repository
  ) {}

  public async execute(id: string, streamPath: string, args: PrePublishArgs): Promise<void> {
    const session = mediaDriverInstance.getSession(id);

    if (args.key) {
      const username = streamPath.substring(streamPath.lastIndexOf('/') + 1, streamPath.length);

      const getUserByStreamingKeyUseCase = container.resolve(GetUserByStreamingKeyUseCase);

      const data = await getUserByStreamingKeyUseCase.execute(username, args.key);

      if (!data) {
        return session.reject();
      }

      const { streaming } = data;

      const videoUrl = `${Env.get('APP_URL')}:${Env.get('MEDIA_HTTP_PORT')}/live/${username}.flv`;

      await this.streamingsRepository.update(streaming, {
        video_url: videoUrl,
      });
    } else {
      return session.reject();
    }
  }
}
