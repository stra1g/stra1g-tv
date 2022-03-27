import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database';
import User from 'App/Modules/User/Models/User';
import { IChannelRole } from '../../Interfaces/IChannelRole';
import ChannelRole from '../../Models/ChannelRole';

export class ChannelRolesRepositoryInMemory implements IChannelRole.Repository {
  public channelRoles: ChannelRole[] = [];

  public async listUsersChannelRole(
    _channelId: number,
    _page: number,
    _perPage: number
  ): Promise<SimplePaginatorContract<IChannelRole.UserChannelRoleResponse>> {
    throw new Error('Method not implemented.');
  }

  public async storeUserChannelRole(
    _channelRole: ChannelRole,
    _channelId: number,
    _userId: number
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public getAvailableRoles(): string[] {
    throw new Error('Method not implemented.');
  }

  public async findUserChannelRole(
    _user: User,
    _channelId: number
  ): Promise<IChannelRole.UserChannelRole | null> {
    throw new Error('Method not implemented.');
  }

  public async destroyUserChannelRole(_user: User, _channelId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async updateUserChannelRole(
    _user: User,
    _channelId: number,
    _channelRoleId: number
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async store(payload: IChannelRole.DTO.Store): Promise<ChannelRole> {
    const channelRole = new ChannelRole();

    Object.assign(channelRole, { ...payload, id: this.channelRoles.length + 1 });

    this.channelRoles.push(channelRole);

    return channelRole;
  }

  public async findBy(key: string, value: any): Promise<ChannelRole | null> {
    const channelRole = this.channelRoles.find((channelRole) => channelRole[key] === value);

    if (!channelRole) return null;

    return channelRole;
  }
}
