import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UnauthorizedException from '../Exceptions/UnauthorizedException';

export default class Can {
  public async handle(
    { auth, i18n }: HttpContextContract,
    next: () => Promise<void>,
    guards?: string[]
  ) {
    const userRoles = (await auth.user?.related('roles').query()) || [];
    const userPermissions = (await auth.user?.related('permissions').query()) || [];

    for (const role of userRoles) {
      const rolePermissions = await role.related('permissions').query();
      userPermissions.push(...rolePermissions);
    }

    const hasPermission = userPermissions.some((permission) => {
      if (guards?.includes(permission.name)) return true;

      const [method, resource] = permission.name.split('_');
      const guardsMethods = guards?.map((guard) => guard.split('_')[0]);

      if (guardsMethods?.includes(method) && resource === '*') {
        return true;
      }
    });

    if (!hasPermission)
      throw new UnauthorizedException(i18n.formatMessage('messages.errors.not_allowed'));

    await next();
  }
}
