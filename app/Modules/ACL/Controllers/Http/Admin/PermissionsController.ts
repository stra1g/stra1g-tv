import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { container } from 'tsyringe';

import { CreatePermissionUseCase } from 'App/Modules/ACL/UseCases/CreatePermissionUseCase/CreatePermissionUseCase';

export default class PermissionsController {
  public async store({ response, request }: HttpContextContract): Promise<void> {
    const { name, description } = request.body();

    const createPermissionUseCase = container.resolve(CreatePermissionUseCase);

    const permission = await createPermissionUseCase.execute({ name, description });

    return response.json(permission);
  }
}
