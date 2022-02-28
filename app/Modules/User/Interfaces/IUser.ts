import Permission from 'App/Modules/ACL/Models/Permission';
import Role from 'App/Modules/ACL/Models/Role';
import User from '../Models/User';

export namespace IUser {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<User>;
    attachRoles(user: User, roles: Role[]): Promise<void>;
    attachPermissions(user: User, permissions: Permission[]): Promise<void>;
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
