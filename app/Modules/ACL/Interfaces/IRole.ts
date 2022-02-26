import Permission from '../Models/Permission';
import Role from '../Models/Role';

export namespace IRole {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<Role>;
    attachPermissions(role: Role, permissions: Permission[]): Promise<void>;
  }

  export interface Helpers {
    findBy(key: string, value: any): Promise<Role | null>;
  }

  export namespace DTO {
    export interface Store {
      name: string;
      description: string;
    }
  }
}
