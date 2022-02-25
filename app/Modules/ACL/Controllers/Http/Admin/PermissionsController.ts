import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { container } from 'tsyringe';

import { CreatePermissionUseCase } from 'App/Modules/ACL/UseCases/Permission/CreatePermissionUseCase/CreatePermissionUseCase';

export default class PermissionsController {
  public async store({ response, request }: HttpContextContract): Promise<void> {
    const { method, resource, description } = request.body();

    const createPermissionUseCase = container.resolve(CreatePermissionUseCase);

    const permission = await createPermissionUseCase.execute({ method, resource, description });

    return response.json(permission);
  }
}
