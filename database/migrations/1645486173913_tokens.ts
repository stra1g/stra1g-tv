import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ApiTokens extends BaseSchema {
  protected tableName = 'tokens';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('name').nullable();
      table.string('type').notNullable();
      table.string('token', 1000).notNullable().unique();
      table.boolean('is_revoked').defaultTo(false);

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('expires_at', { useTz: true }).nullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
