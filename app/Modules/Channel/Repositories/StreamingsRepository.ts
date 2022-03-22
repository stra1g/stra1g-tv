import { DateTime } from 'luxon';
import { IStreaming } from '../Interfaces/IStreaming';
import Streaming from '../Models/Streaming';

export class StreamingsRepository implements IStreaming.Repository {
  public async store(payload: IStreaming.DTO.Store): Promise<Streaming> {
    const streaming = await Streaming.create(payload);

    return streaming;
  }

  public async findOnlineStreamingByChannel(channelId: number): Promise<Streaming | null> {
    const streaming = await Streaming.query()
      .where({ channel_id: channelId, finished_at: null })
      .first();

    return streaming;
  }

  public async finishStreaming(streaming: Streaming): Promise<Streaming> {
    streaming.merge({ finished_at: DateTime.now() });

    await streaming.save();

    return streaming;
  }

  public async findBy(key: string, value: any): Promise<Streaming | null> {
    const streaming = await Streaming.findBy(key, value);

    return streaming;
  }
}
