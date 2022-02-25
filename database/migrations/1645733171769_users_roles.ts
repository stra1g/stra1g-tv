import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UserRole extends BaseSchema {
  protected tableName = 'user_role';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('user_id').unsigned().references('users.id');
      table.integer('role_id').unsigned().references('roles.id');
      table.unique(['user_id', 'role_id']);

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
