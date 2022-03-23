import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { schema, rules } from '@ioc:Adonis/Core/Validator';

export namespace UserChannelRoleValidator {
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
        channel_id: schema.number([rules.exists({ table: 'channels', column: 'id' })]),
        channel_role_id: schema.number(),
        user_id: schema.number(),
      });

      return { schema: storeSchema, messages: this.messages };
    }
  }
}
