import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Channels extends BaseSchema {
  protected tableName = 'channels';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('title');
      table.string('description').nullable();
      table.boolean('online').defaultTo(false);
      table.boolean('banned').defaultTo(false);
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');

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
