import I18n from '@ioc:Adonis/Addons/I18n';
import HttpContext from '@ioc:Adonis/Core/HttpContext';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';
import { IPermission } from 'App/Modules/ACL/Interfaces/IPermission';

import { IRole } from 'App/Modules/ACL/Interfaces/IRole';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import { injectable, inject } from 'tsyringe';

interface Request {
  role_id: number;
  permissionIds: number[];
}

interface ResponsePermissionObject {
  id: number;
  description: string;
  resource: string;
  method: string;
}

interface ResponseRoleObject extends ModelObject {
  id: number;
  name: string;
  description: string;
  permissions: ResponsePermissionObject[];
}

@injectable()
export class AttachPermissionsUseCase {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRole.Repository,
    @inject('PermissionsRepository')
    private permissionsRepository: IPermission.Repository
  ) {}

  public async execute({ role_id, permissionIds }: Request): Promise<ResponseRoleObject> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const role = await this.rolesRepository.findBy('id', role_id);

    if (!role) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.role'),
        })
      );
    }

    const verifiedPermissions = await this.permissionsRepository.findMany(permissionIds);

    await this.rolesRepository.syncPermissions(role, verifiedPermissions);

    return role.toObject() as ResponseRoleObject;
  }
}
