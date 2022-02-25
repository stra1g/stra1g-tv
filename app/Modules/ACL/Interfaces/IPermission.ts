import Permission from '../Models/Permission';

export namespace IPermission {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<Permission>;
  }

  export interface Helpers {
    findBy(key: string, value: any): Promise<Permission | null>;
  }

  export namespace DTO {
    export interface Store {
      name: string;
      description: string;
    }
  }
}
