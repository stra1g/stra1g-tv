import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { SyncPermissionsUseCase } from 'App/Modules/User/UseCases/User/SyncPermissionsUseCase/SyncPermissionsUseCase';
import { SyncRolesUseCase } from 'App/Modules/User/UseCases/User/SyncRolesUseCase/SyncRolesUseCase';
import { UserValidator } from 'App/Modules/User/Validators/User';
import { container } from 'tsyringe';

export default class UsersController {
  public async syncPermissions(ctx: HttpContextContract): Promise<void> {
    const { request, params, response } = ctx;
    const { id } = params;

    const validator = await new UserValidator.SyncPermissions(ctx).createSchema();
    const { permission_ids: permissionIds } = await request.validate(validator);

    const syncPermissionsUseCase = container.resolve(SyncPermissionsUseCase);

    const user = await syncPermissionsUseCase.execute({
      userId: id,
      permissionIds,
    });

    return response.status(200).json(user);
  }

  public async syncRoles(ctx: HttpContextContract): Promise<void> {
    const { request, params, response } = ctx;
    const { id } = params;

    const validator = await new UserValidator.SyncRoles(ctx).createSchema();
    const { role_ids: roleIds } = await request.validate(validator);

    const syncRolesUseCase = container.resolve(SyncRolesUseCase);

    const user = await syncRolesUseCase.execute({
      userId: id,
      roleIds,
    });

    return response.status(200).json(user);
  }
}
