import Env from '@ioc:Adonis/Core/Env';
import crypto from 'node:crypto';
import { inject, injectable } from 'tsyringe';

import { IToken } from 'App/Modules/User/Interfaces/IToken';

@injectable()
export class GetUserStreamingUrlUseCase {
  constructor(
    @inject('TokensRepository')
    private tokensRepository: IToken.Repository
  ) {}

  public async execute(userId: number, streamKey: string): Promise<string> {
    await this.tokensRepository.revokeByUserAndType(userId, IToken.TokenTypes.streamingUser);

    const token = crypto.randomBytes(32).toString('hex');

    await this.tokensRepository.store({
      user_id: userId,
      expires_at: null,
      name: `streaming_user-${userId}`,
      token,
      type: IToken.TokenTypes.streamingUser,
    });

    const streamingServerUrl = `${Env.get('RTMP_SERVER_URL')}/${streamKey}?auth_token=${token}`;

    return streamingServerUrl;
  }
}
