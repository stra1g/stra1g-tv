import { container, inject, injectable } from 'tsyringe';

import { mediaDriverInstance } from '../index';
import { getQueryParams } from '../Utils/getQueryParams';
import { GetStreamingByTokenUseCase } from '../UseCases/GetStreamingByTokenUseCase/GetStreamingByTokenUseCase';
import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';

@injectable()
export class DonePublishEvent {
  constructor(
    @inject('StreamingsRepository')
    private streamingsRepository: IStreaming.Repository
  ) {}

  public async execute(id: string, streamPath: string, _args: object) {
    console.log(`[DonePublish]: Executing`);
    const session = mediaDriverInstance.getSession(id);

    const queryParams = getQueryParams(streamPath);

    if (queryParams.auth_token) {
      const getStreamingByTokenUseCase = container.resolve(GetStreamingByTokenUseCase);

      const streaming = await getStreamingByTokenUseCase.execute(queryParams.auth_token);

      if (!streaming) {
        return session.reject();
      }

      await this.streamingsRepository.finishStreaming(streaming);
    }
  }
}
