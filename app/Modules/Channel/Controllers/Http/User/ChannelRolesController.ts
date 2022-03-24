import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { container } from 'tsyringe';

import { ListUserChannelRoleUseCase } from 'App/Modules/Channel/UseCases/ChannelRole/ListUserChannelRoleUseCase/ListUserChannelRoleUseCase';
import { UserChannelRoleValidator } from 'App/Modules/Channel/Validators/UserChannelRole';
import { StoreUserChannelRoleUseCase } from 'App/Modules/Channel/UseCases/ChannelRole/StoreUserChannelRoleUseCase/StoreUserChannelRoleUseCase';
import { DestroyUserChannelRoleUseCase } from 'App/Modules/Channel/UseCases/ChannelRole/DestroyUserChannelRoleUseCase/DestroyUserChannelRoleUseCase';
import { UpdateUserChannelRoleUseCase } from 'App/Modules/Channel/UseCases/ChannelRole/UpdateUserChannelRoleUseCase/UpdateUserChannelRoleUseCase';

export default class ChannelRolesController {
  public async listUserChannelRoles({ request, params, response }: HttpContextContract) {
    const { id } = params;
    const page = request.input('page', 1);
    const perPage = request.input('per_page', 20);

    const listUserChannelRoleUseCase = container.resolve(ListUserChannelRoleUseCase);
    const userChannelRoles = await listUserChannelRoleUseCase.execute(id, page, perPage);

    return response.json(userChannelRoles);
  }

  public async storeUserChannelRole(ctx: HttpContextContract) {
    const { request, response, i18n } = ctx;

    const validator = await new UserChannelRoleValidator.Store(ctx).createSchema();
    const {
      channel_id: channelId,
      channel_role_id: channelRoleId,
      user_id: userId,
    } = await request.validate(validator);

    const storeUserChannelRoleUseCase = container.resolve(StoreUserChannelRoleUseCase);
    await storeUserChannelRoleUseCase.execute({
      channelId,
      channelRoleId,
      userId,
    });

    return response.json({
      message: i18n.formatMessage('messages.success.successfully_assigned_role'),
    });
  }

  public async destroyUserChannelRole({ params, response, i18n }: HttpContextContract) {
    const { id: channelId, user_id: userId } = params;

    const destroyUserChannelRoleUseCase = container.resolve(DestroyUserChannelRoleUseCase);

    await destroyUserChannelRoleUseCase.execute(userId, channelId);

    return response.status(204).json({
      message: i18n.formatMessage('messages.successfully_deleted', {
        model: i18n.formatMessage('models.channel_role'),
      }),
    });
  }

  public async updateUserChannelRole(ctx: HttpContextContract) {
    const { request, response, i18n } = ctx;

    const validator = await new UserChannelRoleValidator.Update(ctx).createSchema();
    const {
      channel_id: channelId,
      channel_role_id: channelRoleId,
      user_id: userId,
    } = await request.validate(validator);

    const updateUserChannelRoleUseCase = container.resolve(UpdateUserChannelRoleUseCase);
    await updateUserChannelRoleUseCase.execute({
      channelId,
      channelRoleId,
      userId,
    });

    return response.json({
      message: i18n.formatMessage('messages.success.successfully_assigned_role'),
    });
  }
}
