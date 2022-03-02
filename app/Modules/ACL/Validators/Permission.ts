import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export namespace PermissionValidator {
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
        method: schema.string(),
        resource: schema.string(),
        description: schema.string(),
      });

      return { schema: storeSchema, messages: this.messages };
    }
  }
}
