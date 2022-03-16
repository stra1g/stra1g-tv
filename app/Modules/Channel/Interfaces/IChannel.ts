import Channel from '../Models/Channel';

export namespace IChannel {
  export interface Repository extends Helpers {
    store(data: DTO.Store): Promise<Channel>;
    show(channelId: number): Promise<Channel | null>;
  }

  export interface Helpers {
    findBy(key: string, value: any): Promise<Channel | null>;
  }

  export namespace DTO {
    export interface Store {
      title: string;
      description: string;
      user_id: number;
    }
  }
}
