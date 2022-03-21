import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UserChannelRoles extends BaseSchema {
  protected tableName = 'user_channel_roles';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table
        .integer('channel_id')
        .unsigned()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE');
      table
        .integer('channel_role_id')
        .unsigned()
        .references('id')
        .inTable('channel_roles')
        .onDelete('CASCADE');

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
