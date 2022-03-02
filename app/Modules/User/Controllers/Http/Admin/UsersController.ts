import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AttachPermissionsUseCase } from 'App/Modules/User/UseCases/User/SyncPermissionsUseCase/AttachPermissionsUseCase';
import { AttachRolesUseCase } from 'App/Modules/User/UseCases/User/SyncRolesUseCase/AttachRolesUseCase';
import { UserValidator } from 'App/Modules/User/Validators/User';
import { container } from 'tsyringe';

export default class UsersController {
  public async syncPermissions(ctx: HttpContextContract): Promise<void> {
    const { request, params, response } = ctx;
    const { id } = params;

    const validator = await new UserValidator.AttachPermissions(ctx).createSchema();
    const { permission_ids: permissionIds } = await request.validate(validator);

    const attachPermissionsUseCase = container.resolve(AttachPermissionsUseCase);

    const user = await attachPermissionsUseCase.execute({
      userId: id,
      permissionIds,
    });

    return response.status(200).json(user);
  }

  public async syncRoles(ctx: HttpContextContract): Promise<void> {
    const { request, params, response } = ctx;
    const { id } = params;

    const validator = await new UserValidator.AttachRoles(ctx).createSchema();
    const { role_ids: roleIds } = await request.validate(validator);

    const attachRolesUseCase = container.resolve(AttachRolesUseCase);

    const user = await attachRolesUseCase.execute({
      userId: id,
      roleIds,
    });

    return response.status(200).json(user);
  }
}
