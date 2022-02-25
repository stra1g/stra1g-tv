import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PermissionUser extends BaseSchema {
  protected tableName = 'permission_user';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('user_id').unsigned().references('users.id');
      table.integer('permission_id').unsigned().references('permissions.id');
      table.unique(['user_id', 'permission_id']);

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
