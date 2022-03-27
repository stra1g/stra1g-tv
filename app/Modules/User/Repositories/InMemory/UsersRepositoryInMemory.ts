import { ManyToMany, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import Permission from 'App/Modules/ACL/Models/Permission';
import Role from 'App/Modules/ACL/Models/Role';
import ChannelRole from 'App/Modules/Channel/Models/ChannelRole';
import { IUser } from '../../Interfaces/IUser';
import User from '../../Models/User';

export class UsersRepositoryInMemory implements IUser.Repository {
  public async index(
    _page: number,
    _perPage: number,
    _search: string
  ): Promise<ModelPaginatorContract<User>> {
    throw new Error('Method not implemented.');
  }

  public async getUserRoles(_user: User): Promise<Role[]> {
    throw new Error('Method not implemented.');
  }

  public async findUserRoleByName(_user: User, _roleName: string): Promise<Role | null> {
    throw new Error('Method not implemented.');
  }

  public async findChannelRoleByChannelAndRole(
    _user: User,
    _channelId: number,
    _channelRoles: string[]
  ): Promise<ChannelRole | null> {
    throw new Error('Method not implemented.');
  }
  public users: User[] = [];

  public async store({ password, username, email, name }: IUser.DTO.Store): Promise<User> {
    const user = new User();

    Object.assign(user, { password, username, email, name, id: this.users.length + 1 });

    this.users.push(user);

    return user;
  }

  public async findBy(key: string, value: any): Promise<User | null> {
    const user = this.users.find((user) => user[key] === value);

    if (!user) return null;

    return user;
  }

  public async syncRoles(user: User, roles: Role[]): Promise<void> {
    user.roles = roles as ManyToMany<typeof Role>;
  }

  public async syncPermissions(user: User, permissions: Permission[]): Promise<void> {
    user.permissions = permissions as ManyToMany<typeof Permission>;
  }
}
