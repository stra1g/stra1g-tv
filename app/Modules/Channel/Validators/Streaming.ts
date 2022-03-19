import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { schema, rules } from '@ioc:Adonis/Core/Validator';

export namespace StreamingValidator {
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
        title: schema.string(),
        description: schema.string(),
        channel_id: schema.number([rules.exists({ table: 'channels', column: 'id' })]),
        video_url: schema.string(),
      });

      return { schema: storeSchema, messages: this.messages };
    }
  }
}
