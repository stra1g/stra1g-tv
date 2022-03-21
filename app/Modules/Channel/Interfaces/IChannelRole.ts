import ChannelRole from '../Models/ChannelRole';

export namespace IChannelRole {
  export interface Repository extends Helpers {
    store(payload: DTO.Store): Promise<ChannelRole>;
  }

  export interface Helpers {
    findBy(key: string, value: any): Promise<ChannelRole | null>;
  }

  export namespace DTO {
    export interface Store {
      role: string;
      description: string;
    }
  }
}
