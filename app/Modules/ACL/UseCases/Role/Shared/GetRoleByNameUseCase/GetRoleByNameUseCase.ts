import { inject, injectable } from 'tsyringe';

import { IRole } from 'App/Modules/ACL/Interfaces/IRole';
import Role from 'App/Modules/ACL/Models/Role';

@injectable()
export class GetRoleByNameUseCase {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRole.Repository
  ) {}

  public async execute(name: string): Promise<Role | null> {
    const role = await this.rolesRepository.findBy('name', name);

    return role;
  }
}
