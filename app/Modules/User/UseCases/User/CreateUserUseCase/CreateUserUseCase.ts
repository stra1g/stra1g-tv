import HttpContext from '@ioc:Adonis/Core/HttpContext';
import I18n from '@ioc:Adonis/Addons/I18n';
import { inject, injectable } from 'tsyringe';

import AppException from 'App/Shared/Exceptions/AppException';
import { IUser } from '../../../Interfaces/IUser';
import User from '../../../Models/User';
import { IRole } from 'App/Modules/ACL/Interfaces/IRole';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository,
    @inject('RolesRepository')
    private rolesRepository: IRole.Repository
  ) {}

  public async execute({
    email,
    name,
    password,
    username,
  }: IUser.DTO.Store): Promise<User | AppException> {
    const ctx = HttpContext.get()!;
    const i18n = ctx ? ctx.i18n : I18n.locale('pt-br');

    const usernameAlreadyExists = await this.usersRepository.findBy('username', username);

    if (usernameAlreadyExists) {
      throw new AppException(
        i18n.formatMessage('messages.errors.property_already_exists', { property: 'username' })
      );
    }

    const emailAlreadyExists = await this.usersRepository.findBy('email', email);

    if (emailAlreadyExists) {
      throw new AppException(
        i18n.formatMessage('messages.errors.property_already_exists', { property: 'email' })
      );
    }

    const user = await this.usersRepository.store({ name, email, username, password });

    const commonUserRole = await this.rolesRepository.findBy('name', 'common_user');

    if (commonUserRole) {
      await this.usersRepository.attachRoles(user, [commonUserRole]);
    }

    return user;
  }
}
