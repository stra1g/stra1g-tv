import Env from '@ioc:Adonis/Core/Env';
import { inject, injectable } from 'tsyringe';

import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import { IToken } from 'App/Modules/User/Interfaces/IToken';
import { IUser } from 'App/Modules/User/Interfaces/IUser';
import { mediaDriverInstance } from '../index';

type StreamPath = {
  app: string;
  type?: string;
  supportsGoAway?: boolean;
  flashVer?: string;
  swfUrl?: string;
  tcUrl?: string;
};

type QueryParams = {
  [key: string]: string | null | undefined;
};

@injectable()
export class PreConnectEvent {
  constructor(
    @inject('TokensRepository')
    private tokensRepository: IToken.Repository,
    @inject('UsersRepository')
    private usersRepository: IUser.Repository,
    @inject('StreamingsRepository')
    private streamingsRepository: IStreaming.Repository
  ) {}

  public async execute(id: string, streamPath: StreamPath, _args: object): Promise<void> {
    const session = mediaDriverInstance.getSession(id);

    const queryParams = PreConnectEvent.getQueryParams(streamPath.app);

    if (queryParams.auth_token) {
      const token = await this.tokensRepository.findStreamingUserToken(queryParams.auth_token);

      if (!token) {
        return session.reject();
      }

      const user = await this.usersRepository.findBy('id', token.user_id);

      if (!user) {
        return session.reject();
      }

      const streaming = await this.streamingsRepository.getCurrentStreamingByUser(user.id);

      if (!streaming) {
        return session.reject();
      }

      const videoUrl = `${Env.get('APP_URL')}/live/${streaming.channel.stream_key}`;

      await this.streamingsRepository.update(streaming, {
        video_url: videoUrl,
      });
    }
  }

  private static getQueryParams(url: string): QueryParams {
    const queryParamsString = url.substring(url.indexOf('?') + 1, url.length);

    const queryParamsArray = queryParamsString.split('&');

    const queryParams = {};

    queryParamsArray.forEach((item) => {
      const [key, value] = item.split('=');

      Object.assign(queryParams, {
        [key]: value,
      });
    });

    return queryParams;
  }
}
