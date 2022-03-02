import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { container } from 'tsyringe';

import { CreatePermissionUseCase } from 'App/Modules/ACL/UseCases/Permission/CreatePermissionUseCase/CreatePermissionUseCase';
import { PermissionValidator } from 'App/Modules/ACL/Validators/Permission';

export default class PermissionsController {
  public async store(ctx: HttpContextContract): Promise<void> {
    const { response, request } = ctx;

    const validator = await new PermissionValidator.Store(ctx).createSchema();
    const permissionData = await request.validate(validator);

    const createPermissionUseCase = container.resolve(CreatePermissionUseCase);

    const permission = await createPermissionUseCase.execute(permissionData);

    return response.json(permission);
  }
}
