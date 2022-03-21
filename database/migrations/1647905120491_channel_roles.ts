import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ChannelRoles extends BaseSchema {
  protected tableName = 'channel_roles';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('role');
      table.string('description');

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
