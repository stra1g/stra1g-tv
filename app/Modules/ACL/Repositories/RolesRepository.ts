import { IRole } from '../Interfaces/IRole';
import Permission from '../Models/Permission';
import Role from '../Models/Role';

export class RolesRepository implements IRole.Repository {
  public async store({ name, description }: IRole.DTO.Store): Promise<Role> {
    const role = await Role.create({ name, description });

    return role;
  }

  public async findBy(key: string, value: string): Promise<Role | null> {
    const role = await Role.findBy(key, value);

    return role;
  }

  public async syncPermissions(role: Role, permissions: Permission[]): Promise<void> {
    const permissionIds = permissions.map((permission) => permission.id);

    await role.related('permissions').sync(permissionIds);

    await role.load('permissions');
  }

  public async findMany(role_ids: number[]): Promise<Role[]> {
    const roles = await Role.findMany(role_ids);

    return roles;
  }
}
