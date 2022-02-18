import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('name').notNullable();
      table.string('username').unique().notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.boolean('is_deleted').defaultTo(false);
      table.timestamp('deleted_at', { useTz: true });
      table.timestamp('first_login_at', { useTz: true });
      table.string('avatar');
      table.string('language');
      table.boolean('online').defaultTo(false);

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
