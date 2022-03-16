import { IChannel } from '../Interfaces/IChannel';
import Channel from '../Models/Channel';

export class ChannelsRepository implements IChannel.Repository {
  public async store(data: IChannel.DTO.Store): Promise<Channel> {
    const channel = await Channel.create(data);

    return channel;
  }

  public async show(channelId: number): Promise<Channel | null> {
    const channel = await Channel.query().where({ id: channelId }).preload('user').first();

    return channel;
  }

  public async findBy(key: string, value: any): Promise<Channel | null> {
    const channel = await Channel.findBy(key, value);

    return channel;
  }
}
