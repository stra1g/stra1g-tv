import { IPermission } from '../../Interfaces/IPermission';
import Permission from '../../Models/Permission';

export class PermissionsRepositoryInMemory implements IPermission.Repository {
  public permissions: Permission[] = [];

  public async store({ description, name }: IPermission.DTO.Store): Promise<Permission> {
    const permission = new Permission();

    Object.assign(permission, {
      description,
      name,
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
}
