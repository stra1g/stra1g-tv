import I18n from '@ioc:Adonis/Addons/I18n';
import HttpContext from '@ioc:Adonis/Core/HttpContext';

import { IRole } from 'App/Modules/ACL/Interfaces/IRole';
import AppException from 'App/Shared/Exceptions/AppException';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateRoleUseCase {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRole.Repository
  ) {}

  public async execute({ description, name }: IRole.DTO.Store) {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const nameAlreadyExists = await this.rolesRepository.findBy('name', name);

    if (nameAlreadyExists) {
      throw new AppException(
        i18n.formatMessage('messages.errors.property_already_exists', { property: 'name' })
      );
    }

    const role = await this.rolesRepository.store({ name, description });

    return role;
  }
}
