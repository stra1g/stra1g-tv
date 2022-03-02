import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AttachPermissionsUseCase } from 'App/Modules/User/UseCases/User/AttachPermissionsUseCase/AttachPermissionsUseCase';
import { UserValidator } from 'App/Modules/User/Validators/User';
import { container } from 'tsyringe';

export default class UsersController {
  public async attachPermissions(ctx: HttpContextContract): Promise<void> {
    const { request, params, response } = ctx;
    const { id } = params;

    const validator = await new UserValidator.AttachPermissions(ctx).createSchema();
    const { permission_ids: permissionIds } = await request.validate(validator);

    const attachPermissionsUseCase = container.resolve(AttachPermissionsUseCase);

    const user = await attachPermissionsUseCase.execute({
      user_id: id,
      permissionIds,
    });

    return response.status(200).json(user);
  }
}
