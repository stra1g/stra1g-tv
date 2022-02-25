import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UnauthorizedException from '../Exceptions/UnauthorizedException';

export default class Is {
  public async handle(
    { auth, i18n }: HttpContextContract,
    next: () => Promise<void>,
    guards?: string[]
  ) {
    const userRoles = await auth.user?.related('roles').query();

    if (!userRoles)
      throw new UnauthorizedException(i18n.formatMessage('messages.errors.not_allowed'));

    for (const role of userRoles) {
      if (guards?.includes(role.name)) {
        await next();
      }
    }

    throw new UnauthorizedException(i18n.formatMessage('messages.errors.not_allowed'));
  }
}
