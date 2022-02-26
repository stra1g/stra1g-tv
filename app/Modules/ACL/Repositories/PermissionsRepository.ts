import { IPermission } from '../Interfaces/IPermission';
import Permission from '../Models/Permission';

export class PermissionsRepository implements IPermission.Repository {
  public async store(data: IPermission.DTO.Store): Promise<Permission> {
    const permission = await Permission.create(data);

    return permission;
  }

  public async findBy(key: string, value: any): Promise<Permission | null> {
    const permission = await Permission.findBy(key, value);

    return permission;
  }

  public async findByMethodAndResource(
    method: string,
    resource: string
  ): Promise<Permission | null> {
    const permission = await Permission.query()
      .where({
        method,
        resource,
      })
      .first();

    if (!permission) return null;

    return permission;
  }

  public async findMany(permission_ids: number[]): Promise<Permission[]> {
    const permissions = await Permission.findMany(permission_ids);

    return permissions;
  }
}
