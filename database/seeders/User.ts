import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Role from 'App/Modules/ACL/Models/Role';
import User from 'App/Modules/User/Models/User';
import { SyncRolesUseCase } from 'App/Modules/User/UseCases/User/SyncRolesUseCase/SyncRolesUseCase';
import { container } from 'tsyringe';

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const users = await User.createMany([
      {
        name: 'admin',
        username: 'admin',
        email: 'admin@stra1g.com',
        password: 'admin',
      },
      {
        name: 'user',
        username: 'user',
        email: 'user@stra1g.com',
        password: 'user',
      },
    ]);

    const adminUser = users[0];
    const adminRole = await Role.findBy('name', 'admin');
    const syncRolesUseCase = container.resolve(SyncRolesUseCase);
    if (adminRole) {
      await syncRolesUseCase.execute({ userId: adminUser.id, roleIds: [adminRole.id] });
    }
  }
}
