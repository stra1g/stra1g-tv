import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { container } from 'tsyringe';

import { ListUserChannelRoleUseCase } from 'App/Modules/Channel/UseCases/ChannelRole/ListUserChannelRoleUseCase/ListUserChannelRoleUseCase';

export default class ChannelRolesController {
  public async listUserChannelRoles({ request, params, response }: HttpContextContract) {
    const { id } = params;
    const page = request.input('page', 1);
    const perPage = request.input('per_page', 20);

    const listUserChannelRoleUseCase = container.resolve(ListUserChannelRoleUseCase);
    const userChannelRoles = await listUserChannelRoleUseCase.execute(id, page, perPage);

    return response.json(userChannelRoles);
  }
}
