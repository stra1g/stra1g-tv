import crypto from 'crypto';

import { IToken } from 'App/Modules/User/Interfaces/IToken';
import { IUser } from 'App/Modules/User/Interfaces/IUser';
import { DateTime } from 'luxon';

export class ForgotPasswordUseCase {
  constructor(
    private usersRepository: IUser.Repository,
    private tokensRepository: IToken.Repository
  ) {}

  public async execute(email: string) {
    const user = await this.usersRepository.findBy('email', email);

    if (!user) return null;

    const stringToken = crypto.randomBytes(32).toString('hex');

    await this.tokensRepository.store({
      user_id: user.id,
      type: 'forgot_password',
      expires_at: DateTime.now().plus({ minutes: 5 }),
      name: 'Forgot password',
      token: stringToken,
    });
  }
}
