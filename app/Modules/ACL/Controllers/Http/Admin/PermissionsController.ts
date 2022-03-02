import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { container } from 'tsyringe';

import { CreatePermissionUseCase } from 'App/Modules/ACL/UseCases/Permission/CreatePermissionUseCase/CreatePermissionUseCase';
import { PermissionValidator } from 'App/Modules/ACL/Validators/Permission';
import { IndexPermissionsUseCase } from 'App/Modules/ACL/UseCases/Permission/IndexPermissionsUseCase/IndexPermissionsUseCase';

export default class PermissionsController {
  public async store(ctx: HttpContextContract): Promise<void> {
    const { response, request } = ctx;

    const validator = await new PermissionValidator.Store(ctx).createSchema();
    const permissionData = await request.validate(validator);

    const createPermissionUseCase = container.resolve(CreatePermissionUseCase);

    const permission = await createPermissionUseCase.execute(permissionData);

    return response.json(permission);
  }

  public async index(ctx: HttpContextContract): Promise<void> {
    const page = ctx.request.input('page', 1);
    const perPage = ctx.request.input('per_page', 20);

    const indexPermissionsUseCase = container.resolve(IndexPermissionsUseCase);

    const permissions = await indexPermissionsUseCase.execute(page, perPage);

    return ctx.response.json(permissions);
  }
}
