import { IPermission } from '../../Interfaces/IPermission';
import Permission from '../../Models/Permission';

export class PermissionsRepositoryInMemory implements IPermission.Repository {
  public permissions: Permission[] = [];

  public async store({
    description,
    method,
    resource,
  }: IPermission.DTO.Store): Promise<Permission> {
    const permission = new Permission();

    Object.assign(permission, {
      description,
      method,
      resource,
      id: this.permissions.length + 1,
    });

    this.permissions.push(permission);

    return permission;
  }

  public async findBy(key: string, value: any): Promise<Permission | null> {
    const permission = this.permissions.find((permission) => permission[key] === value);

    if (!permission) return null;

    return permission;
  }

  public async findByMethodAndResource(
    method: string,
    resource: string
  ): Promise<Permission | null> {
    const permission = this.permissions.find(
      (permission) => permission.method === method && permission.resource === resource
    );

    if (!permission) return null;

    return permission;
  }

  public async findMany(permission_ids: number[]): Promise<Permission[]> {
    const permissions = this.permissions.filter((permission) =>
      permission_ids.includes(permission.id)
    );

    return permissions;
  }
}
