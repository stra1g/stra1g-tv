import { container, inject, injectable } from 'tsyringe';

import { mediaDriverInstance } from '../index';

import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import { PrePublishArgs } from '../Interfaces/IStreamPath';
import { GetUserByStreamingKeyUseCase } from '../UseCases/GetUserByStreamingKeyUseCase/GetUserByStreamingKeyUseCase';

@injectable()
export class DonePublishEvent {
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

      await this.streamingsRepository.finishStreaming(streaming);
    }
  }
}
