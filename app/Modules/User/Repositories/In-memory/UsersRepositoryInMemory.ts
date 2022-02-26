import { ManyToMany } from '@ioc:Adonis/Lucid/Orm';
import Role from 'App/Modules/ACL/Models/Role';
import { IUser } from '../../Interfaces/IUser';
import User from '../../Models/User';

export class UsersRepositoryInMemory implements IUser.Repository {
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

  public async attachRoles(user: User, roles: Role[]): Promise<void> {
    user.roles = roles as ManyToMany<typeof Role>;
  }
}
