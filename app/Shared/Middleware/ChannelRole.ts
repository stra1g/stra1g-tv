import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { UsersRepository } from 'App/Modules/User/Repositories/UsersRepository';
import UnauthorizedException from '../Exceptions/UnauthorizedException';

export default class ChannelRole {
  public async handle(
    { request, auth, i18n, params }: HttpContextContract,
    next: () => Promise<void>,
    guards: string[]
  ) {
    const usersRepository = new UsersRepository();

    if (auth.user) {
      const isAdmin = await usersRepository.findUserRoleByName(auth.user, 'admin');

      if (isAdmin) {
        return next();
      }

      const channelId = request.body().channel_id || params.id;

      if (channelId) {
        const hasChannelRole = await usersRepository.findChannelRoleByChannelAndRole(
          auth.user,
          channelId,
          guards
        );

        if (hasChannelRole) {
          return next();
        }
      }

      throw new UnauthorizedException(i18n.formatMessage('messages.errors.not_allowed'));
    }
  }
}
