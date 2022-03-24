import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database';
import User from 'App/Modules/User/Models/User';

import { DateTime } from 'luxon';
import ChannelRole from '../Models/ChannelRole';

export namespace IChannelRole {
  export interface Repository extends Helpers {
    store(payload: DTO.Store): Promise<ChannelRole>;
    listUsersChannelRole(
      channelId: number,
      page: number,
      perPage: number
    ): Promise<SimplePaginatorContract<UserChannelRoleResponse>>;
    storeUserChannelRole(
      channelRole: ChannelRole,
      channelId: number,
      userId: number
    ): Promise<void>;
    getAvailableRoles(): Array<string>;
    findUserChannelRole(user: User, channelId: number): Promise<UserChannelRole | null>;
    destroyUserChannelRole(user: User, channelId: number): Promise<void>;
  }

  export interface Helpers {
    findBy(key: string, value: any): Promise<ChannelRole | null>;
  }

  export interface UserChannelRoleResponse {
    name: string;
    username: string;
    role: string;
    created_at: DateTime;
  }

  export interface UserChannelRole {
    id: number;
    user_id: number;
    channel_id: number;
    channel_role_id: number;
    created_at: DateTime;
    updated_at: DateTime;
  }

  export namespace DTO {
    export interface Store {
      role: string;
      description: string;
    }
  }
}
