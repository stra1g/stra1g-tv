import I18n from '@ioc:Adonis/Addons/I18n';
import HttpContext from '@ioc:Adonis/Core/HttpContext';

import { IRole } from 'App/Modules/ACL/Interfaces/IRole';
import { IUser } from 'App/Modules/User/Interfaces/IUser';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: number;
  roleIds: number[];
}

@injectable()
export class AttachRolesUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository,
    @inject('RolesRepository')
    private rolesRepository: IRole.Repository
  ) {}

  public async execute({ userId, roleIds }: Request) {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const user = await this.usersRepository.findBy('id', userId);

    if (!user) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user'),
        })
      );
    }

    const verifiedRoles = await this.rolesRepository.findMany(roleIds);

    await this.usersRepository.syncRoles(user, verifiedRoles);

    return user.serialize();
  }
}
