import { IUser } from 'App/Modules/User/Interfaces/IUser';
import { User } from '../Models/User';

export class UsersRepository implements IUser.Repository {
  public repository: typeof User;

  constructor() {
    this.repository = User;
  }

  public async store(data: IUser.DTO.Store): Promise<User> {
    const user = await User.create(data);

    return user;
  }
}
