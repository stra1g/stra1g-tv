import { IStreaming } from '../Interfaces/IStreaming';
import Streaming from '../Models/Streaming';

export class StreamingsRepository implements IStreaming.Repository {
  public async store(payload: IStreaming.DTO.Store): Promise<Streaming> {
    const streaming = await Streaming.create(payload);

    return streaming;
  }

  public async findOnlineStreaming(channelId: number): Promise<Streaming | null> {
    const streaming = await Streaming.query()
      .where({ channel_id: channelId, finished_at: null })
      .first();

    return streaming;
  }

  public async findBy(key: string, value: any): Promise<Streaming | null> {
    const streaming = await Streaming.findBy(key, value);

    return streaming;
  }
}
