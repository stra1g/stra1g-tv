import { IRole } from '../../Interfaces/IRole';
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

  public async findBy(key: string, value: string): Promise<Role | null> {
    const role = this.roles.find((role) => role[key] === value);

    if (!role) return null;

    return role;
  }
}
