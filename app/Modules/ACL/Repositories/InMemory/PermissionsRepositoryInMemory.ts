import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
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

  public async index(page: number, perPage: number): Promise<ModelPaginatorContract<Permission>> {
    const meta = {};
    const data: Permission[] = [];

    const total = this.permissions.length;
    const lastPage = total / perPage;
    const nextPageUrl = page - lastPage === 0 ? null : `/?page=${page + 1}`;
    const previousPageUrl = page - 1 === 0 ? null : `/?page=${page - 1}`;

    Object.assign(meta, {
      total,
      per_page: perPage,
      current_page: page,
      last_page: lastPage,
      first_page: 1,
      first_page_url: '/?page=1',
      last_page_url: `/?page=${lastPage}`,
      next_page_url: nextPageUrl,
      previous_page_url: previousPageUrl,
    });

    for (let i = 0; i < perPage; i++) {
      data.push(this.permissions[i]);
    }

    return {
      meta,
      data,
    } as any;
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
