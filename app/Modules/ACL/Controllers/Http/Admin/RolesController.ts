import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { container } from 'tsyringe';

import { CreateRoleUseCase } from 'App/Modules/ACL/UseCases/Role/CreateRoleUseCase/CreateRoleUseCase';
import { AttachPermissionsUseCase } from 'App/Modules/ACL/UseCases/Role/AttachPermissionsUseCase/AttachPermissionsUseCase';

export default class RolesController {
  public async store({ response, request }: HttpContextContract): Promise<void> {
    const { name, description } = request.body();

    const createRoleUseCase = container.resolve(CreateRoleUseCase);

    const role = await createRoleUseCase.execute({ name, description });

    return response.json(role);
  }

  public async attachPermissions({
    request,
    response,
    params,
  }: HttpContextContract): Promise<void> {
    const { id } = params;
    const { permission_ids: permissionIds } = request.body();

    const attachPermissionsUseCase = container.resolve(AttachPermissionsUseCase);

    const role = await attachPermissionsUseCase.execute({ role_id: id, permissionIds });

    return response.json(role);
  }
}
