import { container, delay } from 'tsyringe';
import { IToken } from '../Interfaces/IToken';
import { IUser } from '../Interfaces/IUser';
import { TokensRepository } from '../Repositories/TokensRepository';
import { UsersRepository } from '../Repositories/UsersRepository';

container.registerSingleton<IUser.Repository>('UsersRepository', UsersRepository);
container.registerSingleton<IToken.Repository>(
  'TokensRepository',
  delay(() => TokensRepository)
);
