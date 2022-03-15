import { ManyToMany, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import { IRole } from '../../Interfaces/IRole';
import Permission from '../../Models/Permission';
import Role from '../../Models/Role';

export class RolesRepositoryInMemory implements IRole.Repository {
  public roles: Role[] = [];

  public async store({ name, description }: IRole.DTO.Store): Promise<Role> {
    const role = new Role();

    Object.assign(role, {
      name,
      description,
      id: this.roles.length + 1,
    });

    this.roles.push(role);

    return role;
  }

  public async index(page: number, perPage: number): Promise<ModelPaginatorContract<Role>> {
    const meta = {};
    const data: Role[] = [];

    const total = this.roles.length;
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
      data.push(this.roles[i]);
    }

    return {
      meta,
      data,
    } as any;
  }

  public async findBy(key: string, value: string): Promise<Role | null> {
    const role = this.roles.find((role) => role[key] === value);

    if (!role) return null;

    return role;
  }

  public async syncPermissions(role: Role, permissions: Permission[]): Promise<void> {
    role.permissions = permissions as ManyToMany<typeof Permission>;
  }

  public async findMany(role_ids: number[]): Promise<Role[]> {
    const roles = this.roles.filter((role) => role_ids.includes(role.id));

    return roles;
  }
}
