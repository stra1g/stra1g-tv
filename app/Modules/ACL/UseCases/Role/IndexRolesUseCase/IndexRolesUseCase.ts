import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import { inject, injectable } from 'tsyringe';

import { IRole } from 'App/Modules/ACL/Interfaces/IRole';
import Role from 'App/Modules/ACL/Models/Role';

@injectable()
export class IndexRolesUseCase {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRole.Repository
  ) {}

  public async execute(page: number, perPage: number): Promise<ModelPaginatorContract<Role>> {
    const roles = await this.rolesRepository.index(page, perPage);

    return roles;
  }
}
