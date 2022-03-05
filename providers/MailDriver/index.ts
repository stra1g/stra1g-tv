import { MailDriverContract, MessageNode } from '@ioc:Adonis/Addons/Mail';
import { createTestAccount, createTransport, getTestMessageUrl, Transporter } from 'nodemailer';

export type EtherealConfig = {
  driver: 'ethereal';
  auth: {
    user: string;
    password: string;
  };
};

export class Ethereal implements MailDriverContract {
  private transporter: Transporter;

  constructor(config: EtherealConfig) {
    this.transporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: config.auth.user,
        pass: config.auth.password,
      },
    });
  }

  public static async createTestAccount() {
    return createTestAccount();
  }

  public async send(message: MessageNode): Promise<any> {
    const info = await this.transporter.sendMail({
      from: message.from?.address,
      to: message.from?.address,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', getTestMessageUrl(info));
  }

  public async close(): Promise<void> {
    this.transporter.close();
  }
}
