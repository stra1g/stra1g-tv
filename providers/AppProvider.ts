import { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    await import('../app/Shared/Container');
    const { BcryptCustom } = await import('./HashDriver');
    const { Ethereal } = await import('./MailDriver');
    const etherealTestAccount = await Ethereal.createTestAccount();
    const Hash = this.app.container.use('Adonis/Core/Hash');
    const Mail = this.app.container.use('Adonis/Addons/Mail');

    Mail.extend('ethereal', (_mail, _mapping, config) => {
      return new Ethereal({
        ...config,
        auth: { user: etherealTestAccount.user, password: etherealTestAccount.pass },
      });
    });

    Hash.extend('bcryptCustom', () => {
      return new BcryptCustom();
    });
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
