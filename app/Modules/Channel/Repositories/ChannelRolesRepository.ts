import Database, { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database';
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
    const userChannelRole: SimplePaginatorContract<IChannelRole.UserChannelRoleResponse> =
      await Database.from('channel_roles')
        .select('name', 'username', 'role', 'user_channel_roles.created_at')
        .join('user_channel_roles', 'user_channel_roles.channel_role_id', 'channel_roles.id')
        .join('users', 'users.id', 'user_channel_roles.user_id')
        .where('user_channel_roles.channel_id', channelId)
        .whereNot('channel_roles.role', 'owner')
        .paginate(page, perPage);

    return userChannelRole;
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

  public getValidRoles(): string[] {
    return ChannelRole.availableRoles;
  }
}
