import Mail from '@ioc:Adonis/Addons/Mail';
import Env from '@ioc:Adonis/Core/Env';
import { injectable } from 'tsyringe';

interface SendMailData {
  from: string;
  to: string;
  subject: string;
  htmlView: string;
  params: object;
}

@injectable()
export class SendMailUseCase {
  public async execute({ from, to, subject, htmlView, params }: SendMailData): Promise<null> {
    const enviroment = Env.get('NODE_ENV');

    if (enviroment === 'testing') {
      await Mail.use('ethereal').sendLater((message) => {
        message.from(from).to(to).subject(subject).html('local mail test');
      });

      return null;
    }

    await Mail.send((message) => {
      message.from(from).to(to).subject(subject).htmlView(htmlView, params);
    });

    return null;
  }
}
