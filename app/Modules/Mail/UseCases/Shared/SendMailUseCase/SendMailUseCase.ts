import Mail from '@ioc:Adonis/Addons/Mail';
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
    await Mail.send((message) => {
      message.from(from).to(to).subject(subject).htmlView(htmlView, params);
    });

    return null;
  }
}
