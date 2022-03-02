import Permission from 'App/Modules/ACL/Models/Permission';
import Role from 'App/Modules/ACL/Models/Role';
import { IUser } from 'App/Modules/User/Interfaces/IUser';
import User from '../Models/User';

export class UsersRepository implements IUser.Repository {
  public repository: typeof User;

  constructor() {
    this.repository = User;
  }

  public async findBy(key: string, value: any): Promise<User | null> {
    const user = await User.findBy(key, value);

    return user;
  }

  public async store(data: IUser.DTO.Store): Promise<User> {
    const user = await User.create(data);

    return user;
  }

  public async syncRoles(user: User, roles: Role[]): Promise<void> {
    const roleIds = roles.map((role) => role.id);

    await user.related('roles').sync(roleIds);

    await user.load('roles');
  }

  public async syncPermissions(user: User, permissions: Permission[]): Promise<void> {
    const permissionIds = permissions.map((permission) => permission.id);

    await user.related('permissions').sync(permissionIds);

    await user.load('permissions');
  }
}
