import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AttachPermissionsUseCase } from 'App/Modules/User/UseCases/AttachPermissionsUseCase/AttachPermissionsUseCase';
import { container } from 'tsyringe';

export default class UsersController {
  public async attachPermissions({
    request,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params;
    const { permission_ids: permissionIds } = request.body();

    const attachPermissionsUseCase = container.resolve(AttachPermissionsUseCase);

    const user = await attachPermissionsUseCase.execute({ user_id: id, permissionIds });

    return response.status(200).json(user);
  }
}
