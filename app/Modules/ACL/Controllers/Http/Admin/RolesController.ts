import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { container } from 'tsyringe';

import { CreateRoleUseCase } from 'App/Modules/ACL/UseCases/Role/CreateRoleUseCase/CreateRoleUseCase';
import { AttachPermissionsUseCase } from 'App/Modules/ACL/UseCases/Role/SyncPermissionsUseCase/AttachPermissionsUseCase';
import { RoleValidator } from 'App/Modules/ACL/Validators/Role';

export default class RolesController {
  public async store(ctx: HttpContextContract): Promise<void> {
    const { response, request } = ctx;

    const validator = await new RoleValidator.Store(ctx).createSchema();
    const roleData = await request.validate(validator);

    const createRoleUseCase = container.resolve(CreateRoleUseCase);

    const role = await createRoleUseCase.execute(roleData);

    return response.json(role);
  }

  public async syncPermissions(ctx: HttpContextContract): Promise<void> {
    const { request, response, params } = ctx;
    const { id } = params;

    const validator = await new RoleValidator.AttachPermissions(ctx).createSchema();
    const { permission_ids: permissionIds } = await request.validate(validator);

    const attachPermissionsUseCase = container.resolve(AttachPermissionsUseCase);

    const role = await attachPermissionsUseCase.execute({ role_id: id, permissionIds });

    return response.json(role);
  }
}
