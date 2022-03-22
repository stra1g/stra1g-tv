import { DateTime } from 'luxon';
import { IStreaming } from '../../Interfaces/IStreaming';
import Streaming from '../../Models/Streaming';

export class StreamingsRepositoryInMemory implements IStreaming.Repository {
  public streamings: Streaming[] = [];

  public async store({
    channel_id,
    description,
    title,
    video_url,
  }: IStreaming.DTO.Store): Promise<Streaming> {
    const streaming = new Streaming();

    Object.assign(streaming, {
      channel_id,
      description,
      title,
      video_url,
      id: this.streamings.length + 1,
      finished_at: null,
    });

    this.streamings.push(streaming);

    return streaming;
  }

  public async findOnlineStreaming(channelId: number): Promise<Streaming | null> {
    const streaming = this.streamings.find(
      (streaming) => streaming.channel_id === channelId && streaming.finished_at === null
    );

    if (!streaming) return null;

    return streaming;
  }

  public async findBy(key: string, value: any): Promise<Streaming | null> {
    const streaming = this.streamings.find((streaming) => streaming[key] === value);

    if (!streaming) return null;

    return streaming;
  }

  public async findOnlineStreamingByChannel(channelId: number): Promise<Streaming | null> {
    const streaming = this.streamings.find(
      (streaming) => streaming.channel_id === channelId && streaming.finished_at === null
    );

    if (!streaming) return null;

    return streaming;
  }

  public async finishStreaming(streaming: Streaming): Promise<Streaming> {
    const index = this.streamings.indexOf(streaming);

    Object.assign(streaming, { finished_at: DateTime.now() });

    this.streamings.splice(index, 1, streaming);

    return streaming;
  }
}
