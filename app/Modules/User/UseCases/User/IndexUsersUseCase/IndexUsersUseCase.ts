import { inject, injectable } from 'tsyringe';
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';

import { IUser } from 'App/Modules/User/Interfaces/IUser';
import User from 'App/Modules/User/Models/User';

@injectable()
export class IndexUsersUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository
  ) {}

  public async execute(
    page: number,
    perPage: number,
    search: string
  ): Promise<ModelPaginatorContract<User>> {
    const users = await this.usersRepository.index(page, perPage, search);

    return users;
  }
}
