import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PermissionsRoles extends BaseSchema {
  protected tableName = 'permissions_roles';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('role_id').unsigned().references('roles.id');
      table.integer('permission_id').unsigned().references('permissions.id');
      table.unique(['role_id', 'permission_id']);

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
