import { DateTime } from 'luxon';
import Streaming from '../Models/Streaming';

export namespace IStreaming {
  export interface Repository extends Helpers {
    store(payload: DTO.Store): Promise<Streaming>;
    findOnlineStreaming(channelId: number): Promise<Streaming | null>;
  }

  export interface Helpers {
    findBy(key: string, value: any): Promise<Streaming | null>;
  }

  export namespace DTO {
    export interface Store {
      title: string;
      description: string;
      channel_id: number;
      video_url: string;
    }

    export interface Update {
      title?: string;
      description?: string;
      video_url?: string;
      finished_at?: DateTime;
    }
  }
}
