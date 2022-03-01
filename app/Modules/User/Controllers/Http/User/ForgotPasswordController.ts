import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ForgotPasswordUseCase } from 'App/Modules/User/UseCases/User/ForgotPasswordUseCase/ForgotPasswordUseCase';
import { container } from 'tsyringe';

export default class ForgotPasswordController {
  public async store({ response, request, i18n }: HttpContextContract): Promise<void> {
    const { email } = request.body();

    const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);

    await forgotPasswordUseCase.execute(email);

    return response.json({ message: i18n.formatMessage('messages.success.mail_sended') });
  }
}
