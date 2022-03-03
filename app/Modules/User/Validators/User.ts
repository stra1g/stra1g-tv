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
        username: schema.string({ trim: true }),
        email: schema.string({}, [rules.email()]),
        password: schema.string(),
      });

      return { schema: storeSchema, messages: this.messages };
    }
  }

  export class AttachPermissions {
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

  export class AttachRoles {
    constructor(protected ctx: HttpContextContract) {}

    private i18n = this.ctx.i18n;
    public messages = {
      '*': (field, rule) => {
        return this.i18n.formatMessage(`validation.${rule}`, { field });
      },
    };

    public async createSchema() {
      const storeSchema = schema.create({
        role_ids: schema.array().members(schema.number()),
      });

      return { schema: storeSchema, messages: this.messages };
    }
  }
}
