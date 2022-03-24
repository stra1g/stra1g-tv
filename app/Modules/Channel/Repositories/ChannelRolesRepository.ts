import Database, { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database';
import User from 'App/Modules/User/Models/User';

import { IChannelRole } from '../Interfaces/IChannelRole';
import ChannelRole from '../Models/ChannelRole';

export class ChannelRolesRepository implements IChannelRole.Repository {
  public async store(payload: IChannelRole.DTO.Store): Promise<ChannelRole> {
    const channelRole = await ChannelRole.create(payload);

    return channelRole;
  }

  public async findBy(key: string, value: any): Promise<ChannelRole | null> {
    const channelRole = await ChannelRole.findBy(key, value);

    return channelRole;
  }

  public async listUsersChannelRole(
    channelId: number,
    page: number,
    perPage: number
  ): Promise<SimplePaginatorContract<IChannelRole.UserChannelRoleResponse>> {
    const userChannelRoles: SimplePaginatorContract<IChannelRole.UserChannelRoleResponse> =
      await Database.from('channel_roles')
        .select('name', 'username', 'role', 'user_channel_roles.created_at')
        .join('user_channel_roles', 'user_channel_roles.channel_role_id', 'channel_roles.id')
        .join('users', 'users.id', 'user_channel_roles.user_id')
        .where('user_channel_roles.channel_id', channelId)
        .whereNot('channel_roles.role', 'owner')
        .paginate(page, perPage);

    return userChannelRoles;
  }

  public async storeUserChannelRole(
    channelRole: ChannelRole,
    channelId: number,
    userId: number
  ): Promise<void> {
    await channelRole.related('channels').attach({
      [channelId]: {
        user_id: userId,
      },
    });
  }

  public getAvailableRoles(): string[] {
    return ChannelRole.availableRoles;
  }

  public async findUserChannelRole(
    user: User,
    channelId: number
  ): Promise<IChannelRole.UserChannelRole | null> {
    const userChannelRole: IChannelRole.UserChannelRole | null = await user
      .related('channelRoles')
      .pivotQuery()
      .where({
        channel_id: channelId,
      })
      .first();

    return userChannelRole;
  }

  public async destroyUserChannelRole(user: User, channelId: number): Promise<void> {
    await user.related('channelRoles').pivotQuery().where({ channel_id: channelId }).delete();
  }

  public async updateUserChannelRole(
    user: User,
    channelId: number,
    channelRoleId: number
  ): Promise<void> {
    await user
      .related('channelRoles')
      .pivotQuery()
      .where({ channel_id: channelId })
      .update({ channel_role_id: channelRoleId });
  }
}
