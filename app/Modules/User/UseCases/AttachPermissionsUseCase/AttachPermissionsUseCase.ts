import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import { IPermission } from 'App/Modules/ACL/Interfaces/IPermission';
import NotFoundException from 'App/Shared/Exceptions/NotFoundException';

import { IUser } from '../../Interfaces/IUser';

interface Request {
  user_id: number;
  permissionIds: number[];
}

@injectable()
export class AttachPermissionsUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository,
    @inject('PermissionsRepository')
    private permissionsRepository: IPermission.Repository
  ) {}

  public async execute({ user_id, permissionIds }: Request) {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const verifiedPermissions = await this.permissionsRepository.findMany(permissionIds);

    const user = await this.usersRepository.findBy('id', user_id);

    if (!user) {
      throw new NotFoundException(
        i18n.formatMessage('messages.errors.not_found', {
          model: i18n.formatMessage('models.user'),
        })
      );
    }

    await this.usersRepository.attachPermissions(user, verifiedPermissions);

    return user.serialize();
  }
}
