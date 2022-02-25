import { IRole } from '../Interfaces/IRole';
import Role from '../Models/Role';

export class RolesRepository implements IRole.Repository {
  public async findBy(key: string, value: string): Promise<Role | null> {
    const role = await Role.findBy(key, value);

    return role;
  }
}
