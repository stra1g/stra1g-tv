import { DateTime } from 'luxon';
import Channel from '../Models/Channel';

export namespace IChannel {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<Channel>;
    show(channelId: number): Promise<Channel | null>;
    update(channel: Channel, payload: DTO.Update): Promise<Channel>;
    findByUserAndChannel(userId: number, channelId: number): Promise<Channel | null>;
    listUsersChannelRole(
      channel: Channel,
      page: number,
      perPage: number
    ): Promise<UserChannelRoleResponse[]>;
  }

  export interface Helpers {
    findBy(key: string, value: any): Promise<Channel | null>;
  }

  export interface UserChannelRoleResponse {
    name: string;
    username: string;
    role: string;
    created_at: DateTime;
  }

  export namespace DTO {
    export interface Store {
      name: string;
      description: string;
      user_id: number;
    }

    export interface Update {
      name?: string;
      description?: string;
    }
  }
}
