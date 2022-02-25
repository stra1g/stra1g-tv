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
    method,
    resource,
    description,
  }: IPermission.DTO.Store): Promise<Permission | AppException> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const permissionAlreadyExists = await this.permissionsRepository.findByMethodAndResource(
      method,
      resource
    );

    if (permissionAlreadyExists) {
      throw new AppException(
        i18n.formatMessage('messages.errors.model_already_exists', {
          model: i18n.formatMessage('models.permission'),
        })
      );
    }

    const permission = await this.permissionsRepository.store({ method, resource, description });

    return permission;
  }
}
