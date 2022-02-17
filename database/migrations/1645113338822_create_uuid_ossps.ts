import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CreateUuidOssps extends BaseSchema {
  public async up() {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  }

  public async down() {
    await this.db.rawQuery('DROP EXTENSION "uuid-ossp";');
  }
}
