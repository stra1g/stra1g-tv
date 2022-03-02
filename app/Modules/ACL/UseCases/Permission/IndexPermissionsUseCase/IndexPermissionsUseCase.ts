import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import { IPermission } from 'App/Modules/ACL/Interfaces/IPermission';
import Permission from 'App/Modules/ACL/Models/Permission';
import { inject, injectable } from 'tsyringe';

@injectable()
export class IndexPermissionsUseCase {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermission.Repository
  ) {}

  public async execute(page: number, perPage: number): Promise<ModelPaginatorContract<Permission>> {
    const permissions = await this.permissionsRepository.index(page, perPage);

    return permissions;
  }
}
