import { DateTime } from 'luxon';
import { IStreaming } from '../Interfaces/IStreaming';
import Streaming from '../Models/Streaming';

export class StreamingsRepository implements IStreaming.Repository {
  public repository: typeof Streaming;

  constructor() {
    this.repository = Streaming;
  }

  public async store(payload: IStreaming.DTO.Store): Promise<Streaming> {
    const streaming = await this.repository.create(payload);

    return streaming;
  }

  public async findOnlineStreamingByChannel(channelId: number): Promise<Streaming | null> {
    const streaming = await this.repository
      .query()
      .where({ channel_id: channelId, finished_at: null })
      .first();

    return streaming;
  }

  public async finishStreaming(streaming: Streaming): Promise<Streaming> {
    streaming.merge({ finished_at: DateTime.now() });

    await streaming.save();

    return streaming;
  }

  public async getCurrentStreamingByUser(userId: number): Promise<Streaming | null> {
    const streaming = await this.repository
      .query()
      .where({
        finished_at: null,
      })
      .preload('channel', (channelQuery) => {
        channelQuery.preload('user', (userQuery) => {
          userQuery.where({ id: userId });
        });
      })
      .first();

    return streaming;
  }

  public async update(streaming: Streaming, payload: IStreaming.DTO.Update): Promise<void> {
    streaming.merge(payload);

    await streaming.save();
  }

  public async findBy(key: string, value: any): Promise<Streaming | null> {
    const streaming = await this.repository.findBy(key, value);

    return streaming;
  }
}
