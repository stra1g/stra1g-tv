import { container } from 'tsyringe';
import { IUser } from '../Interfaces/IUser';
import { UsersRepository } from '../Repositories/UsersRepository';

container.registerSingleton<IUser.Repository>('UsersRepository', UsersRepository);
