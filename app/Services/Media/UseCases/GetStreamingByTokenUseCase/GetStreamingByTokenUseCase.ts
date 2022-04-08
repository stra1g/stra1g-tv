import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import Streaming from 'App/Modules/Channel/Models/Streaming';
import { IToken } from 'App/Modules/User/Interfaces/IToken';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetStreamingByTokenUseCase {
  constructor(
    @inject('TokensRepository')
    private tokensRepository: IToken.Repository,
    @inject('StreamingsRepository')
    private streamingsRepository: IStreaming.Repository
  ) {}

  public async execute(authToken: string): Promise<Streaming | null> {
    const token = await this.tokensRepository.findStreamingUserToken(authToken);

    if (!token) {
      return null;
    }

    const streaming = await this.streamingsRepository.getCurrentStreamingByUser(token.user_id);

    if (!streaming) {
      return null;
    }

    return streaming;
  }
}
