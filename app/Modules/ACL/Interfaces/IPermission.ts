import Permission from '../Models/Permission';

export namespace IPermission {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<Permission>;
    findByMethodAndResource(method: string, resource: string): Promise<Permission | null>;
    findMany(permission_ids: number[]): Promise<Permission[]>;
  }

  export interface Helpers {
    findBy(key: string, value: any): Promise<Permission | null>;
  }

  export namespace DTO {
    export interface Store {
      method: string;
      resource: string;
      description: string;
    }
  }
}
