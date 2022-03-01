import crypto from 'crypto';
import Env from '@ioc:Adonis/Core/Env';
import Mail from '@ioc:Adonis/Addons/Mail';
import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';

import { IToken } from 'App/Modules/User/Interfaces/IToken';
import { IUser } from 'App/Modules/User/Interfaces/IUser';

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository,
    @inject('TokensRepository')
    private tokensRepository: IToken.Repository
  ) {}

  public async execute(email: string) {
    const user = await this.usersRepository.findBy('email', email);

    if (!user) return null;

    const stringToken = crypto.randomBytes(32).toString('hex');

    const forgotPasswordToken = await this.tokensRepository.store({
      user_id: user.id,
      type: 'forgot_password',
      expires_at: DateTime.now().plus({ minutes: 5 }),
      name: 'Forgot password',
      token: stringToken,
    });

    await Mail.send((message) => {
      message
        .from(Env.get('MAIL_FROM'))
        .to(user.email)
        .subject('Reset password process')
        .htmlView('emails/forgot_password', {
          forgot_password_url: `${Env.get('APP_URL')}?token=${forgotPasswordToken.token}`,
        });
    });
  }
}
