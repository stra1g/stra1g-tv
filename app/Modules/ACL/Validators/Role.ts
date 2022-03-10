import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export namespace RoleValidator {
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
        description: schema.string(),
      });

      return { schema: storeSchema, messages: this.messages };
    }
  }

  export class SyncPermissions {
    constructor(protected ctx: HttpContextContract) {}

    private i18n = this.ctx.i18n;
    public messages = {
      '*': (field, rule) => {
        return this.i18n.formatMessage(`validation.${rule}`, { field });
      },
    };

    public async createSchema() {
      const storeSchema = schema.create({
        permission_ids: schema.array().members(schema.number()),
      });

      return { schema: storeSchema, messages: this.messages };
    }
  }
}
