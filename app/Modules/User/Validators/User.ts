import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export namespace UserValidator {
  export class Store {
    constructor(protected ctx: HttpContextContract) {}

    private i18n = this.ctx.i18n;
    public messages = {
      '*': (field, rule) => {
        return this.i18n.formatMessage(`validation.${rule}`, { field });
      },
    };

    public async createSchema() {
      const storeSchema = schema.create({
        name: schema.string(),
        username: schema.string({ trim: true }, [
          rules.unique({ table: 'users', column: 'username' }),
        ]),
        email: schema.string({}, [
          rules.email(),
          rules.unique({ table: 'users', column: 'email' }),
        ]),
        password: schema.string(),
      });

      return { schema: storeSchema, messages: this.messages };
    }
  }
}
