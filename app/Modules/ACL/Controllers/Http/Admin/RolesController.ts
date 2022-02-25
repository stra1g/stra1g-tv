import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { container } from 'tsyringe';

import { CreateRoleUseCase } from 'App/Modules/ACL/UseCases/Role/CreateRoleUseCase/CreateRoleUseCase';

export default class RolesController {
  public async store({ response, request }: HttpContextContract): Promise<void> {
    const { name, description } = request.body();

    const createRoleUseCase = container.resolve(CreateRoleUseCase);

    const role = await createRoleUseCase.execute({ name, description });

    return response.json(role);
  }
}
