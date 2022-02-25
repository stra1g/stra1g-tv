import I18n from '@ioc:Adonis/Addons/I18n';
import HttpContext from '@ioc:Adonis/Core/HttpContext';

import AppException from 'App/Shared/Exceptions/AppException';
import { inject, injectable } from 'tsyringe';
import { IPermission } from '../../Interfaces/IPermission';
import Permission from '../../Models/Permission';

@injectable()
export class CreatePermissionUseCase {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermission.Repository
  ) {}

  public async execute({
    name,
    description,
  }: IPermission.DTO.Store): Promise<Permission | AppException> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const nameAlreadyExists = await this.permissionsRepository.findBy('name', name);

    if (nameAlreadyExists) {
      throw new AppException(
        i18n.formatMessage('messages.errors.already_exists', { property: 'name' })
      );
    }

    const permission = await this.permissionsRepository.store({ name, description });

    return permission;
  }
}
