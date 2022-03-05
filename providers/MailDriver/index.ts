import { MailDriverContract, MessageNode } from '@ioc:Adonis/Addons/Mail';
import { createTestAccount, createTransport, getTestMessageUrl, Transporter } from 'nodemailer';

export type GmailConfig = {
  driver: 'gmail';
  auth: {
    user: string;
    password: string;
  };
};

export class Gmail implements MailDriverContract {
  private transporter: Transporter;

  constructor(config: GmailConfig) {
    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
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
    if (message.from && message.to) {
      const info = await this.transporter.sendMail({
        from: message.from?.address,
        to: message.to[0].address,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', getTestMessageUrl(info));
    }
  }

  public async close(): Promise<void> {
    this.transporter.close();
  }
}
