import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import Permission from 'App/Modules/ACL/Models/Permission';
import Role from 'App/Modules/ACL/Models/Role';
import ChannelRole from 'App/Modules/Channel/Models/ChannelRole';
import User from '../Models/User';

export namespace IUser {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<User>;
    syncRoles(user: User, roles: Role[]): Promise<void>;
    syncPermissions(user: User, permissions: Permission[]): Promise<void>;
    index(page: number, perPage: number, search: string): Promise<ModelPaginatorContract<User>>;
    getUserRoles(user: User): Promise<Role[]>;
    findUserRoleByName(user: User, roleName: string): Promise<Role | null>;
    findChannelRoleByChannelAndRole(
      user: User,
      channelId: number,
      channelRoles: string[]
    ): Promise<ChannelRole | null>;
  }

  export interface Helpers {
    findBy(key: string, value: any): Promise<User | null>;
  }

  export namespace DTO {
    export interface Store {
      name: string;
      username: string;
      email: string;
      password: string;
    }

    export interface Update {
      name?: string;
      username?: string;
      email?: string;
      password?: string;
      avatar?: string;
    }
  }
}
