import crypto from 'crypto';
import Env from '@ioc:Adonis/Core/Env';
import { DateTime } from 'luxon';
import { container, inject, injectable } from 'tsyringe';

import { IToken } from 'App/Modules/User/Interfaces/IToken';
import { IUser } from 'App/Modules/User/Interfaces/IUser';
import { SendMailUseCase } from 'App/Modules/Mail/UseCases/Shared/SendMailUseCase/SendMailUseCase';

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
      expires_at: DateTime.now().plus({ minutes: 10 }),
      name: 'Forgot password',
      token: stringToken,
    });

    const sendMailUseCase = container.resolve(SendMailUseCase);
    await sendMailUseCase.execute({
      from: Env.get('MAIL_FROM'),
      to: user.email,
      subject: 'Reset password process',
      htmlView: 'emails/forgot_password',
      params: {
        forgot_password_url: `${Env.get('APP_URL')}password/reset?token=${
          forgotPasswordToken.token
        }`,
      },
    });
  }
}
