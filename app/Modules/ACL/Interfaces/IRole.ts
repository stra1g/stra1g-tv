import Role from '../Models/Role';

export namespace IRole {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<Role>;
  }

  export interface Helpers {
    findBy(key: string, value: string): Promise<Role | null>;
  }

  export namespace DTO {
    export interface Store {
      name: string;
      description: string;
    }
  }
}
