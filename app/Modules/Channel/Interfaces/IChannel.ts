import { ModelAttributes, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import Channel from '../Models/Channel';

export namespace IChannel {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<Channel>;
    show(channelId: number): Promise<Channel | null>;
    update(channel: Channel, payload: DTO.Update): Promise<Channel>;
    findByUserAndChannel(userId: number, channelId: number): Promise<Channel | null>;
    list(
      page: number,
      perPage: number,
      search: string,
      online: boolean | null
    ): Promise<ModelPaginatorContract<Channel>>;
  }

  export type ChannelModelAttributes = Partial<ModelAttributes<Channel>>;

  export interface Helpers {
    findBy(key: string, value: any): Promise<Channel | null>;
  }

  export namespace DTO {
    export interface Store {
      name: string;
      description: string;
      user_id: number;
      stream_key: string;
    }

    export interface Update {
      name?: string;
      description?: string;
      stream_key?: string;
    }
  }
}
