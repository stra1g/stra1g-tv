import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import Permission from 'App/Modules/ACL/Models/Permission';
import Role from 'App/Modules/ACL/Models/Role';
import ChannelRole from 'App/Modules/Channel/Models/ChannelRole';
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

  public async index(
    page: number,
    perPage: number,
    search: string
  ): Promise<ModelPaginatorContract<User>> {
    const users = await User.query()
      .preload('channel')
      .where((query) => {
        query.withScopes((scopes) => scopes.search(search));
      })
      .orWhere((query) => {
        query.with('channel', (channelQuery) => {
          channelQuery.withScopes((scopes) => scopes.search(search));
        });
      })

      .paginate(page, perPage);

    return users;
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

  public async getUserRoles(user: User): Promise<Role[]> {
    const foundRoles = await user.related('roles').query();

    return foundRoles;
  }

  public async findUserRoleByName(user: User, roleName: string): Promise<Role | null> {
    const role = await user.related('roles').query().where({ name: roleName }).first();

    return role;
  }

  public async findChannelRoleByChannelAndRole(
    user: User,
    channelId: number,
    channelRoles: string[]
  ): Promise<ChannelRole | null> {
    const channelRole = await user
      .related('channelRoles')
      .query()
      .where({ channel_id: channelId })
      .whereIn('role', channelRoles)
      .first();

    return channelRole;
  }
}
